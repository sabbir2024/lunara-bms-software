import { useState } from "react";
import { SiFampay } from "react-icons/si";
import { FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import useUsers from "../../../../hooks/useUsers";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const DuePayments = ({ CustomerDetail, sumDue, onPaymentSuccess, refetch }) => {

    const [isShow, setIsShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0], // Default today's date
        name: CustomerDetail?.name,
        paid: ""
    });
    const [error, setError] = useState("");

    const axiosSecure = useAxiosSecure()
    const now = new Date();

    // Generate unique ID using current date and time
    const generateGatepassId = () => {
        const year = now.getFullYear().toString().slice(-2);
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        return `PAY-${year}${month}${day}${hours}${minutes}${seconds}`;
    };
    const [gatepassNo, setGatepassNo] = useState(generateGatepassId());

    const { users, isLoading: isPending } = useUsers();

    const handleInputChange = (e) => {
        const { id, value } = e.target;

        // Clear any previous errors when user starts typing
        if (id === "paid" && error) {
            setError("");
        }

        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const paidAmount = parseFloat(formData.paid) || 0;

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate that paid amount doesn't exceed due amount
        if (paidAmount > sumDue) {
            setError(`Payment amount (${paidAmount}) cannot exceed total due amount (${sumDue})`);
            return;
        }

        setIsLoading(true);
        if (isPending) {
            setIsLoading(isPending)
        }

        const entry = {
            date: formData.date,
            gatepassNo: gatepassNo,
            updateByLoggedUser: {
                name: users?.data?.name,
                userId: users?.data?.userId,
                _id: users?.data?._id,
                lastUpdate: [now.toLocaleDateString(), now.toLocaleTimeString()],
            },
            paid: paidAmount
        }

        const payload = {
            customer: CustomerDetail,
            details: entry
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            const { data } = await axiosSecure.post(`/dueDetails`, payload)

            if (data.success) {
                toast.success('Payment successful!');

                // Reset form
                setFormData({
                    date: new Date().toISOString().split('T')[0],
                    name: CustomerDetail?.name,
                    paid: ""
                });

                // Clear any errors
                setError("");

                // Close form
                setIsShow(false);

                // Generate new gatepass ID for next payment
                setGatepassNo(generateGatepassId());

                // Call the callback function to refresh parent data
                if (onPaymentSuccess && typeof onPaymentSuccess === 'function') {
                    onPaymentSuccess();
                }
            } else {
                toast.error('Payment failed!');
            }

        } catch (error) {
            toast.error(`${error.message}`);
        } finally {
            setIsLoading(false);
            refetch()
        }
    };

    return (
        <section className="max-w-4xl p-6 mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md shadow-md dark:from-gray-800 dark:to-gray-900">
            <button
                onClick={() => setIsShow(!isShow)}
                className="text-lg font-semibold capitalize dark:text-white flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200">
                <SiFampay className="transform -scale-x-100 text-blue-500" />
                {isShow ? "Hide Payments" : "Show Payments"}
            </button>

            {isShow && (
                <form onSubmit={handleSubmit} className="mt-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Add Payment</h3>

                    {/* Due Summary */}
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-900/20 dark:border-amber-800">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Total Due Amount:</span>
                            <span className="text-lg font-bold text-amber-900 dark:text-amber-100">৳{sumDue.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="date">
                                Date
                            </label>
                            <input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">
                                Customer Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-600 cursor-not-allowed"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="paid">
                                Amount (৳)
                            </label>
                            <input
                                id="paid"
                                type="number"
                                value={formData.paid}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white ${error
                                    ? "border-red-500 focus:ring-red-500 dark:border-red-600"
                                    : "border-gray-300 focus:ring-green-500 dark:border-gray-600"
                                    }`}
                                required
                                min="0"
                                max={sumDue}
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start gap-2 dark:bg-red-900/20 dark:border-red-800">
                            <FaExclamationTriangle className="text-red-500 mt-0.5 flex-shrink-0 dark:text-red-400" />
                            <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                        </div>
                    )}

                    {/* Remaining Balance Preview */}
                    {formData.paid && !error && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:border-blue-800">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Remaining Balance:</span>
                                <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                    ৳{(sumDue - paidAmount).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading || !!error}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Save Payment"
                            )}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
};

export default DuePayments;