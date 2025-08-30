import React, { useState } from "react";
import ProductSection from "./ProductSection";
import FooterSection from "./FooterSection";
import useCustomer from "../../../hooks/useCustomer";
import useProducts from "../../../hooks/useProducts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import CustomerSection from "./CustomerSection";
import useUsers from "../../../hooks/useUsers";
import PDFPreview from "./GatePassPDFPreview";

const Gatepass = () => {
    const { customers } = useCustomer();
    const { products } = useProducts();
    const AxiosSecure = useAxiosSecure();
    const { users, isLoading: isPending } = useUsers();

    const [isLoading, setIsLoading] = useState(false);
    const [showPDFPreview, setShowPDFPreview] = useState(false);
    const [submissionData, setSubmissionData] = useState(null);

    const [customerSearch, setCustomerSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [manualCustomer, setManualCustomer] = useState({
        name: "", guardian: "", age: "", phone: "",
    });

    const [productSearch, setProductSearch] = useState("");
    const [addedProducts, setAddedProducts] = useState([]);
    const [showPaymentFields, setShowPaymentFields] = useState(false);
    const [totalPaid, setTotalPaid] = useState(0);

    const now = new Date();

    // Generate unique ID using current date and time
    const generateGatepassId = () => {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `GP-${year}${month}${day}${hours}${minutes}${seconds}`;
    };

    const [gatepassNo, setGatepassNo] = useState(generateGatepassId());


    // Safely access user data
    const { name, userId, _id } = users?.data || {};
    const loggedUser = {
        name: name || "Unknown User",
        userId: userId || "N/A",
        _id: _id || "N/A",
        lastUpdate: [now.toLocaleDateString(), now.toLocaleTimeString()]
    };

    const matchedCustomers = customers?.data?.filter((c) => {
        const query = customerSearch.toLowerCase();
        return (
            c.name?.toLowerCase().includes(query) ||
            c.guardian?.toLowerCase().includes(query) ||
            c.phone?.toLowerCase().includes(query)
        );
    }) || [];

    const matchedProducts = products?.data?.filter((p) => {
        const query = productSearch.toLowerCase();
        return (
            p.name?.toLowerCase().includes(query) ||
            p.generic?.toLowerCase().includes(query) ||
            p.strength?.toLowerCase().includes(query)
        );
    }) || [];

    const [date, setDate] = useState(() => {
        const today = new Date().toISOString().split('T')[0];
        return today;
    });

    const totalPrice = addedProducts.reduce(
        (sum, item) => sum + (item.price || 0) * (item.qty || 0),
        0
    );
    const dueAmount = Math.max(totalPrice - totalPaid, 0);

    const handleSave = () => {
        if (!selectedCustomer) {
            toast.error("Please select or add a customer");
            return;
        }
        if (addedProducts.length === 0) {
            toast.error("Please add at least one product");
            return;
        }
        setShowPaymentFields(true);
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        if (dueAmount < 0 || totalPaid < 0) {
            toast.error("Invalid payment amount");
            setIsLoading(false);
            return;
        }

        const entry = {
            date,
            gatepassNo,
            updateByLoggedUser: loggedUser,
            total: totalPrice,
            paid: totalPaid,
            products: addedProducts,
            due: dueAmount
        };

        const totalSale = {
            gatepassNo,
            updateByLoggedUser: loggedUser,
            total: totalPrice,
            paid: totalPaid,
            due: dueAmount,
            date: date
        };

        const payload = {
            customer: selectedCustomer,
            details: entry,
        };

        try {
            // Save to sales collection
            const { data: sale } = await AxiosSecure.post('/sale', totalSale);
            if (sale?.success) {
                toast.success('Sale recorded successfully!');
            }

            // Update product quantities
            const updatedProducts = addedProducts.map(product => ({
                _id: product._id,
                sold: (product.sold || 0) + (product.qty || 0)
            }));

            const { data: updatedProduct } = await AxiosSecure.post('/products/bulk-update', updatedProducts);
            if (updatedProduct?.success) {
                toast.success("Product quantities updated!");
            }

            // Save due payment details
            const { data: dueData } = await AxiosSecure.post('/dueDetails', payload);
            if (dueData.success) {
                toast.success('Payment details saved successfully!');

                // Show PDF preview with all data
                setSubmissionData({
                    selectedCustomer,
                    addedProducts,
                    totalPrice,
                    totalPaid,
                    dueAmount,
                    date,
                    loggedUser,
                    gatepassNo
                });
                setShowPDFPreview(true);
            }

        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.response?.data?.message || error.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrintPreview = () => {
        if (!selectedCustomer) {
            toast.error("Please select a customer first");
            return;
        }
        if (addedProducts.length === 0) {
            toast.error("Please add products first");
            return;
        }

        setSubmissionData({
            selectedCustomer,
            addedProducts,
            totalPrice,
            totalPaid: totalPrice, // Show full amount for preview
            dueAmount: 0,
            date,
            loggedUser
        });
        setShowPDFPreview(true);
    };

    const handleClosePDF = () => {
        setShowPDFPreview(false);
        // Reset the form after successful submission
        if (submissionData) {
            setSelectedCustomer(null);
            setAddedProducts([]);
            setTotalPaid(0);
            setShowPaymentFields(false);
            setCustomerSearch("");
            setProductSearch("");
        }
        setSubmissionData(null);
    };

    const handleResetForm = () => {
        setSelectedCustomer(null);
        setAddedProducts([]);
        setTotalPaid(0);
        setShowPaymentFields(false);
        setCustomerSearch("");
        setProductSearch("");
        setManualCustomer({ name: "", guardian: "", age: "", phone: "" });
        setGatepassNo(generateGatepassId());
        toast.success("Form reset successfully");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800">LUNARA ENTERPRISE</h1>
                <p className="text-gray-600">Medical Store & Pharmacy</p>
                <p className="text-sm text-gray-500">Gatepass System</p>
                {/* Display Gatepass ID */}
                <div className="mt-2 bg-blue-100 p-2 rounded-md inline-block">
                    <span className="font-semibold">Gatepass ID:</span> {gatepassNo}
                </div>
            </div>

            {/* Customer Section */}
            <CustomerSection
                customerSearch={customerSearch}
                setCustomerSearch={setCustomerSearch}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                manualCustomer={manualCustomer}
                setManualCustomer={setManualCustomer}
                matchedCustomers={matchedCustomers}
            />

            {/* Product Section */}
            <ProductSection
                productSearch={productSearch}
                setProductSearch={setProductSearch}
                matchedProducts={matchedProducts}
                addedProducts={addedProducts}
                setAddedProducts={setAddedProducts}
            />

            {/* Footer Section */}
            <FooterSection
                addedProducts={addedProducts}
                totalPrice={totalPrice}
                totalPaid={totalPaid}
                setTotalPaid={setTotalPaid}
                dueAmount={dueAmount}
                showPaymentFields={showPaymentFields}
                handleSave={handleSave}
                handleSubmit={handleSubmit}
                handlePrint={handlePrintPreview}
                isLoading={isLoading}
                date={date}
                setDate={setDate}
                onReset={handleResetForm}
                selectedCustomer={selectedCustomer}
                gatepassNo={gatepassNo}
            />

            {/* PDF Preview Modal */}
            {showPDFPreview && submissionData && (
                <PDFPreview
                    {...submissionData}
                    onClose={handleClosePDF}
                />
            )}

            {/* Quick Stats */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm text-gray-600">Products Added</p>
                        <p className="text-xl font-bold">{addedProducts.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-xl font-bold">৳{totalPrice}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Customer</p>
                        <p className="text-lg font-medium">
                            {selectedCustomer ? selectedCustomer.name : "Not selected"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Gatepass;