import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import Swal from "sweetalert2";
import useAxiosSecure from "./useAxiosSecure";

const usePrint = () => {
    const AxiosSecure = useAxiosSecure();

    const handlePrint = async (text, location) => {
        const pathname = location.pathname; // /dashboard/customer/customer-id/1

        // Split by '/' and get last segment
        const parts = pathname.split("/").filter(Boolean);
        const lastPart = parts.pop(); // "1"
        const basePath = "/" + parts.join("/");
        console.log('lastpart', lastPart, 'basePath', basePath);

        if (basePath.startsWith('/dashboard/customer/customer-id')) {
            try {
                const { data } = await AxiosSecure.get(`/dueDetails/${lastPart}`);
                const customerInfo = data?.data[0];
                console.log('customerInfo', customerInfo);

                const doc = new jsPDF();
                let y = 10;

                // Customer info
                doc.setFontSize(10);
                doc.text(`Name: ${customerInfo.name}`, 10, y);
                doc.text(`Guardian Name: ${customerInfo.guardian || '-'}`, 70, y);
                y += 4;

                doc.setFontSize(8);
                doc.text(`Age: ${customerInfo?.age || '-'}`, 10, y);
                doc.text(`Phone: ${customerInfo?.phone || '-'}`, 70, y);
                y += 10;

                let totalDue = 0;
                let totalPaid = 0;

                // Loop through entries by date
                customerInfo.entries.forEach(entry => {
                    if (!entry.products || entry.products.length === 0) return;

                    doc.setFontSize(9);
                    doc.text(`Date: ${entry.date} | Paid: ${entry.paid || 0} | Due: ${entry.due || 0}`, 10, y);
                    y += 4;

                    const tableData = entry.products.map(product => [
                        product.name,
                        product.generic,
                        product.strength,
                        product.manufacturer,
                        product.qty,
                        product.price
                    ]);

                    // Add a footer row showing total price for this entry
                    const totalPrice = entry.products.reduce((sum, p) => sum + Number(p.price) * Number(p.qty), 0);
                    tableData.push(['', '', '', '', 'Total', totalPrice]);

                    autoTable(doc, {
                        startY: y,
                        head: [['Product Name', 'Generic', 'Strength', 'Manufacturer', 'Qty', 'Price']],
                        body: tableData,
                        theme: "grid",
                        styles: { fontSize: 5 },
                        headStyles: { fillColor: [41, 128, 185] },
                        footStyles: { fillColor: [230, 230, 230] },
                    });

                    // Sum due and paid for grand total
                    totalDue += Number(entry.due || 0);
                    totalPaid += Number(entry.paid || 0);

                    y = doc.lastAutoTable.finalY + 10;
                    if (y > 270) {
                        doc.addPage();
                        y = 20;
                    }
                });

                // Calculate remaining balance after summing all entries
                const remainingBalance = totalDue - totalPaid;

                // Grand total remaining at the end
                doc.setFontSize(10);
                doc.text(`Grand Total Remaining: ${remainingBalance}`, 10, y + 5);

                doc.save("customer-summary.pdf");

            } catch (error) {
                Swal.fire("Error", error.message, "error");
            }
        }
    };

    return { handlePrint };
};

export default usePrint;
