import React, { useRef, useState, useEffect } from 'react';
import { FaSpinner, FaPrint, FaTimes } from 'react-icons/fa';

const GatePassPDFPreview = ({
    selectedCustomer,
    addedProducts,
    totalPrice,
    totalPaid,
    dueAmount,
    date,
    loggedUser,
    onClose,
    gatepassNo
}) => {
    const contentRef = useRef();
    const [isPrinting, setIsPrinting] = useState(false);

    // Add keyboard shortcut for printing (Ctrl+P)
    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
                event.preventDefault();
                // Use browser's default print dialog instead of our custom function
                window.print();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handlePrint = () => {
        // Use browser's default print dialog
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <div className="mb-2">
                        <p className="text-lg font-semibold">Gatepass No: {gatepassNo}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* PDF Content - This will be printed */}
                <div ref={contentRef} className=" bg-white">
                    {/* Header */}
                    <div className="text-center mb-6 border-b pb-4">
                        <h1 className="text-2xl font-bold">SABBIR MEDICALE HALL</h1>
                        <p className="text-gray-600">Medical Store & Pharmacy</p>
                        <p className="text-xs  text-gray-600">(Darirpar Madukhali Faridpur)</p>
                        <p className="text-sm text-gray-500">Gatepass Receipt</p>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-2">
                        <h2 className="text-lg font-semibold mb-2">Customer Information</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <p><strong>Name:</strong> {selectedCustomer?.name}</p>
                            <p><strong>Phone:</strong> {selectedCustomer?.phone}</p>
                            {selectedCustomer?.guardian && (
                                <p><strong>Guardian:</strong> {selectedCustomer.guardian}</p>
                            )}
                            {selectedCustomer?.age && (
                                <p><strong>Age:</strong> {selectedCustomer.age}</p>
                            )}
                            {selectedCustomer?.address && (
                                <p><strong>Address:</strong> {selectedCustomer.age}</p>
                            )}
                            <p><strong>Date:</strong> {date}</p>
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Products</h2>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-2">#</th>
                                    <th className="border border-gray-300 p-2">Product Name</th>
                                    <th className="border border-gray-300 p-2">Qty</th>
                                    <th className="border border-gray-300 p-2">Price</th>
                                    <th className="border border-gray-300 p-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {addedProducts.map((item, index) => (
                                    <tr key={item._id || index}>
                                        <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                                        <td className="border border-gray-300 p-2">{item.name}</td>
                                        <td className="border border-gray-300 p-2 text-center">{item.qty}</td>
                                        <td className="border border-gray-300 p-2 text-right">৳{item.price}</td>
                                        <td className="border border-gray-300 p-2 text-right">৳{item.price * item.qty}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Payment Summary */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Payment Summary</h2>
                        <div className="grid grid-cols-2 gap-2 max-w-xs ml-auto">
                            <p><strong>Total Amount:</strong></p>
                            <p className="text-right">৳{totalPrice}</p>

                            <p><strong>Paid Amount:</strong></p>
                            <p className="text-right">৳{totalPaid}</p>

                            <p><strong>Due Amount:</strong></p>
                            <p className="text-right">৳{dueAmount}</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t pt-4 text-center">
                        <p className="text-sm text-gray-600">Thank you for your business!</p>
                        <p className="text-xs text-gray-500">Generated by: {loggedUser?.name}</p>
                        <p className="text-xs text-gray-500">Date: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GatePassPDFPreview;