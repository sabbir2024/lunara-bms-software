import { useParams } from "react-router";
import DuePayments from "../due-payments/DuePayments";
import { useRef, useState } from "react";
import useDueById from "../../../../hooks/useDueById";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import CustomerTable from "./CustomerTable";
import ExportButtons from "./ExportButtons";

const CustomerDetails = () => {
    const { id } = useParams();
    const { data: dueById, isLoading, error, refetch } = useDueById(id);
    const tableRef = useRef(null);
    const [expandedRows, setExpandedRows] = useState({});

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <AiOutlineLoading3Quarters className="animate-spin text-4xl text-blue-500" />
                <span className="ml-2">Loading customer details...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <p className="text-xl text-red-500 mb-2">Error loading data</p>
                    <button
                        onClick={() => refetch()}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Handle different possible response structures
    let customerData = dueById;

    // If response has a data property (common pattern)
    if (dueById && dueById.data) {
        customerData = dueById.data;
    }

    // If data is an array with one element that contains the customer info
    let customerInfo = customerData;
    if (Array.isArray(customerData) && customerData.length > 0) {
        customerInfo = customerData[0];

        // Handle case where the first element might be an object with customer data
        if (customerInfo && Array.isArray(customerInfo)) {
            customerInfo = customerInfo[0];
        }
    }

    if (!customerInfo) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-xl text-gray-500">Customer data not found</p>
            </div>
        );
    }

    const CustomerDetail = {
        _id: customerInfo?._id,
        name: customerInfo?.name,
        guardian: customerInfo?.guardian,
        age: customerInfo?.age,
        phone: customerInfo?.phone,
        address: customerInfo?.address,
    };

    // Extract entries - handle different possible structures
    let entries = [];
    if (customerInfo.entries) {
        entries = customerInfo.entries;
    } else if (customerInfo.data && customerInfo.data.entries) {
        entries = customerInfo.data.entries;
    } else if (Array.isArray(customerInfo) && customerInfo.length > 0 && customerInfo[0].entries) {
        entries = customerInfo[0].entries;
    }

    const totalPrice = entries.reduce(
        (sum, item) => sum + (parseFloat(item?.total) || 0),
        0
    );

    const totalPaid = entries.reduce(
        (sum, item) => sum + (parseFloat(item?.paid) || 0),
        0
    );

    const sumDue = totalPrice - totalPaid;

    const toggleRowExpansion = (index) => {
        setExpandedRows(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Function to export to PDF
    const exportToPDF = () => {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 14;
            let yPosition = 15;

            // Add title
            doc.setFontSize(18);
            doc.text("Customer Due Details", pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 15;

            // Add customer info
            doc.setFontSize(12);
            doc.text(`Customer Name: ${CustomerDetail.name || "N/A"}`, margin, yPosition);
            yPosition += 7;
            doc.text(`Guardian: ${CustomerDetail.guardian || "N/A"}`, margin, yPosition);
            yPosition += 7;
            doc.text(`Phone: ${CustomerDetail.phone || "N/A"}`, margin, yPosition);
            yPosition += 7;
            doc.text(`Address: ${CustomerDetail.address || "N/A"}`, margin, yPosition);
            yPosition += 12;

            // Add summary
            doc.setFont(undefined, "bold");
            doc.text("Summary:", margin, yPosition);
            yPosition += 7;
            doc.setFont(undefined, "normal");
            doc.text(`Total Amount: ${totalPrice.toFixed(2)}`, margin, yPosition);
            yPosition += 7;
            doc.text(`Total Paid: ${totalPaid.toFixed(2)}`, margin, yPosition);
            yPosition += 7;
            doc.text(`Total Due: ${sumDue.toFixed(2)}`, margin, yPosition);
            yPosition += 15;

            // Check if we have entries to display
            if (entries.length === 0) {
                doc.text("No entries found", margin, yPosition);
                doc.save(`customer-due-${CustomerDetail.name}-${new Date().toISOString().slice(0, 10)}.pdf`);
                return;
            }

            // Table headers
            const headers = ["Date", "GatePass No", "Total", "Payments", "Due", "Gate Pass By"];
            const columnWidths = [25, 35, 20, 20, 20, 35];
            const rowHeight = 10;

            // Draw table headers
            doc.setFillColor(41, 128, 185);
            doc.setTextColor(255);
            doc.setFont(undefined, "bold");

            let xPosition = margin;
            headers.forEach((header, i) => {
                doc.rect(xPosition, yPosition, columnWidths[i], rowHeight, 'F');
                doc.text(header, xPosition + 2, yPosition + 7);
                xPosition += columnWidths[i];
            });

            yPosition += rowHeight;

            // Draw table rows
            doc.setTextColor(0);
            doc.setFont(undefined, "normal");

            entries.forEach((item, index) => {
                // Check if we need a new page
                if (yPosition > doc.internal.pageSize.getHeight() - 30) {
                    doc.addPage();
                    yPosition = margin;
                }

                const rowData = [
                    item?.date || "-",
                    item?.gatepassNo || "-",
                    item?.total ? parseFloat(item.total).toFixed(2) : "0.00",
                    item?.paid ? parseFloat(item.paid).toFixed(2) : "0.00",
                    item?.due ? parseFloat(item.due).toFixed(2) : "0.00",
                    item?.updateByLoggedUser?.name || "-"
                ];

                xPosition = margin;
                let maxCellHeight = rowHeight;

                // Draw cell borders and text
                rowData.forEach((cell, i) => {
                    // Split text to fit in cell
                    const lines = doc.splitTextToSize(cell.toString(), columnWidths[i] - 4);
                    const cellHeight = Math.max(rowHeight, lines.length * 7);
                    maxCellHeight = Math.max(maxCellHeight, cellHeight);

                    // Draw cell border
                    doc.rect(xPosition, yPosition, columnWidths[i], cellHeight);

                    // Draw text
                    doc.text(lines, xPosition + 2, yPosition + 7);
                    xPosition += columnWidths[i];
                });

                yPosition += maxCellHeight;

                // Add product details if available
                if (item.products && item.products.length > 0) {
                    // Check if we need a new page
                    if (yPosition > doc.internal.pageSize.getHeight() - 50) {
                        doc.addPage();
                        yPosition = margin;
                    }

                    doc.setFont(undefined, "bold");
                    doc.text("Products:", margin, yPosition);
                    yPosition += 7;

                    // Product table headers
                    const productHeaders = ["Name", "Generic", "Strength", "Manufacturer", "Qty", "Price"];
                    const productColumnWidths = [30, 30, 25, 40, 15, 20];

                    // Draw product headers
                    doc.setFillColor(200, 200, 200);
                    xPosition = margin;
                    productHeaders.forEach((header, i) => {
                        doc.rect(xPosition, yPosition, productColumnWidths[i], rowHeight, 'F');
                        doc.text(header, xPosition + 2, yPosition + 7);
                        xPosition += productColumnWidths[i];
                    });

                    yPosition += rowHeight;

                    // Draw product rows
                    doc.setFont(undefined, "normal");
                    item.products.forEach((product) => {
                        // Check if we need a new page
                        if (yPosition > doc.internal.pageSize.getHeight() - 30) {
                            doc.addPage();
                            yPosition = margin;
                        }

                        const productData = [
                            product?.name || "-",
                            product?.generic || "-",
                            product?.strength || "-",
                            product?.manufacturer || "-",
                            product?.qty?.toString() || "0",
                            product?.price ? parseFloat(product.price).toFixed(2) : "0.00"
                        ];

                        xPosition = margin;
                        let productMaxCellHeight = rowHeight;

                        // Draw product cell borders and text
                        productData.forEach((cell, i) => {
                            const lines = doc.splitTextToSize(cell.toString(), productColumnWidths[i] - 4);
                            const cellHeight = Math.max(rowHeight, lines.length * 7);
                            productMaxCellHeight = Math.max(productMaxCellHeight, cellHeight);

                            // Draw cell border
                            doc.rect(xPosition, yPosition, productColumnWidths[i], cellHeight);

                            // Draw text
                            doc.text(lines, xPosition + 2, yPosition + 7);
                            xPosition += productColumnWidths[i];
                        });

                        yPosition += productMaxCellHeight;
                    });

                    yPosition += 5; // Add some space after products
                }
            });

            // Save the PDF
            doc.save(`customer-due-${CustomerDetail.name}-${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    // Function to export to Excel
    const exportToExcel = () => {
        try {
            // Prepare data for Excel
            const worksheetData = [
                ["Customer Due Details"],
                [],
                ["Customer Name", CustomerDetail.name || "N/A"],
                ["Guardian", CustomerDetail.guardian || "N/A"],
                ["Phone", CustomerDetail.phone || "N/A"],
                ["Address", CustomerDetail.address || "N/A"],
                [],
                ["Summary"],
                ["Total Amount", totalPrice.toFixed(2)],
                ["Total Paid", totalPaid.toFixed(2)],
                ["Total Due", sumDue.toFixed(2)],
                [],
                ["Date", "GatePass No", "Total", "Payments", "Due", "Gate Pass By", "Product Details"],
            ];

            // Add entries data
            if (entries.length > 0) {
                entries.forEach((item) => {
                    // Add the main entry row
                    const mainRow = [
                        item?.date || "",
                        item?.gatepassNo || "",
                        item?.total ? parseFloat(item.total).toFixed(2) : "0.00",
                        item?.paid ? parseFloat(item.paid).toFixed(2) : "0.00",
                        item?.due ? parseFloat(item.due).toFixed(2) : "0.00",
                        item?.updateByLoggedUser?.name || "",
                        item.products && item.products.length > 0 ?
                            `${item.products.length} product(s)` : "No products"
                    ];
                    worksheetData.push(mainRow);

                    // Add product details if available
                    if (item.products && item.products.length > 0) {
                        item.products.forEach((product, idx) => {
                            worksheetData.push([
                                "", // Empty date
                                "", // Empty gatepass no
                                "", // Empty total
                                "", // Empty payments
                                "", // Empty due
                                "", // Empty gate pass by
                                `Product ${idx + 1}: ${product.name} (${product.generic}) - ${product.strength}, Qty: ${product.qty}, Price: ${product.price}`
                            ]);
                        });
                    }
                });
            }

            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(worksheetData);

            // Set column widths
            const colWidths = [
                { wch: 15 }, // Date
                { wch: 20 }, // GatePass No
                { wch: 10 }, // Total
                { wch: 10 }, // Payments
                { wch: 10 }, // Due
                { wch: 15 }, // Gate Pass By
                { wch: 50 }, // Product Details
            ];
            ws["!cols"] = colWidths;

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, "Customer Due Details");

            // Save the file
            XLSX.writeFile(wb, `customer-due-${CustomerDetail.name}-${new Date().toISOString().slice(0, 10)}.xlsx`);
        } catch (error) {
            console.error("Error generating Excel:", error);
            alert("Failed to generate Excel file. Please try again.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Customer Due Details</h2>
                <ExportButtons onExportPDF={exportToPDF} onExportExcel={exportToExcel} />
            </div>

            <DuePayments CustomerDetail={CustomerDetail} sumDue={sumDue} refetch={refetch} />

            <CustomerTable
                entries={entries}
                expandedRows={expandedRows}
                toggleRowExpansion={toggleRowExpansion}
                totalPrice={totalPrice}
                totalPaid={totalPaid}
                sumDue={sumDue}
                tableRef={tableRef}
            />
        </div>
    );
};

export default CustomerDetails;