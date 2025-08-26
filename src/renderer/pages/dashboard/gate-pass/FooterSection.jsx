import React from "react";
import { FaSpinner, FaRedo } from "react-icons/fa";

const FooterSection = ({
    addedProducts, totalPrice,
    totalPaid, setTotalPaid,
    dueAmount, showPaymentFields,
    handleSave, handleSubmit, handlePrint,
    isLoading,
    date, setDate,
    onReset,
    selectedCustomer
}) => {
    if (addedProducts.length === 0) return null;

    return (
        <div className="border p-6 rounded-lg shadow-sm bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Summary */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="font-medium">৳{totalPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Products:</span>
                            <span>{addedProducts.length} items</span>
                        </div>
                        {showPaymentFields && (
                            <>
                                <div className="flex justify-between">
                                    <span>Paid:</span>
                                    <span className="text-green-600 font-medium">৳{totalPaid}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span className="font-semibold">Due:</span>
                                    <span className="text-red-600 font-bold">৳{dueAmount}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Column - Actions */}
                <div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {showPaymentFields && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Paid Amount:</label>
                            <input
                                type="number"
                                min={0}
                                max={totalPrice}
                                value={totalPaid}
                                onChange={(e) => setTotalPaid(Number(e.target.value))}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter paid amount"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end mt-6 pt-4 border-t">
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                    <FaRedo /> Reset Form
                </button>

                {/* Show Print Preview button only when payment fields are visible */}
                {showPaymentFields && (
                    <button
                        onClick={handlePrint}
                        disabled={!selectedCustomer}
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        📄 Print Preview
                    </button>
                )}

                {!showPaymentFields ? (
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                    >
                        {isLoading ? <FaSpinner className="animate-spin" /> : "💾"}
                        {isLoading ? "Processing..." : "Save & Add Payment"}
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-green-400 transition-colors"
                    >
                        {isLoading ? <FaSpinner className="animate-spin" /> : "✅"}
                        {isLoading ? "Submitting..." : "Submit Gatepass"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default FooterSection;