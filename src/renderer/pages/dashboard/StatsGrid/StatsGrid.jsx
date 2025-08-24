import { FiActivity, FiDollarSign, FiTrendingUp, FiUsers } from "react-icons/fi";
import { usefucton } from "../../../provider/FunctionProvider";
import { useState, useEffect } from "react";

// Statistics Cards Component
const StatsGrid = () => {
    const { customerCount, totalDueAmount, isLoading, dayWaysSale, getDaySales } = usefucton();
    const [date, setDate] = useState('');
    const [dateWaysSale, setDateWaysSale] = useState(null);

    // Get today's date in YYYY-MM-DD format for input
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Set today's date as default on component mount
    useEffect(() => {
        const today = getTodayDate();
        setDate(today);
    }, []);

    // Update dateWaysSale when date changes or dayWaysSale updates
    useEffect(() => {
        if (date && dayWaysSale?.length > 0) {
            const dailySales = dayWaysSale.find(day => day.date === date);
            setDateWaysSale(dailySales || {
                date: date,
                totalSales: 0,
                totalPaid: 0,
                totalDue: 0,
                transactions: 0
            });
        }
    }, [date, dayWaysSale]);

    const handelDate = (e) => {
        setDate(e.target.value);
    }

    if (isLoading) return <span className="loading loading-infinity loading-xl"></span>

    const stats = [
        {
            title: 'Total Customer',
            value: `${customerCount}`,
            change: `${totalDueAmount}`,
            trend: 'up',
            icon: <FiUsers className="text-blue-500" size={24} />,
            color: 'blue',
            body: 'is total Due'
        },
        {
            title: 'Daily Revenue',
            input: (
                <input
                    type="date"
                    value={date}
                    onChange={handelDate}
                    className="border p-1 rounded text-sm w-full max-w-[140px]"
                />
            ),
            value: `৳${dateWaysSale?.totalSales || 0}`,
            change: `Paid: ৳${dateWaysSale?.totalPaid || 0}`,
            trend: dateWaysSale?.totalSales > 0 ? 'up' : 'down',
            icon: <FiDollarSign className="text-green-500" size={24} />,
            color: 'green',
            body: `Due: ৳${dateWaysSale?.totalDue || 0}`
        },
        {
            title: 'Transactions',
            value: dateWaysSale ? dateWaysSale.transactions : '0',
            change: date ? `${date}` : getTodayDate(),
            trend: dateWaysSale?.transactions > 0 ? 'up' : 'down',
            icon: <FiActivity className="text-orange-500" size={24} />,
            color: 'orange',
            body: dateWaysSale ? `${dateWaysSale.transactions} transactions` : 'No transactions'
        },
        {
            title: 'Daily Performance',
            value: dateWaysSale ? `৳${dateWaysSale.totalSales}` : '৳0',
            change: dateWaysSale ? `Paid: ৳${dateWaysSale.totalPaid}` : 'Paid: ৳0',
            trend: dateWaysSale?.totalSales > 0 ? 'up' : 'down',
            icon: <FiTrendingUp className="text-purple-500" size={24} />,
            color: 'purple',
            body: dateWaysSale ? `Due: ৳${dateWaysSale.totalDue}` : 'Due: ৳0'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

const StatCard = ({ title, value, change, trend, icon, color, body, input }) => {
    // Safe color classes for Tailwind
    const colorClasses = {
        blue: 'bg-blue-50',
        green: 'bg-green-50',
        orange: 'bg-orange-50',
        purple: 'bg-purple-50'
    };

    const textColorClasses = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        orange: 'text-orange-600',
        purple: 'text-purple-600'
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="mb-2">
                        {input}
                    </div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
            <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                <span className="font-medium">{change}</span>
            </div>
            {body && (
                <div className="mt-2 text-xs text-gray-500">
                    {body}
                </div>
            )}
        </div>
    );
};

export default StatsGrid;