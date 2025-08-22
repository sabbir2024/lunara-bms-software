import { FiActivity, FiDollarSign, FiTrendingUp, FiUsers } from "react-icons/fi";
import useCustomer from "../../../hooks/useCustomer";


// Statistics Cards Component
const StatsGrid = () => {
    const { customers, isLoading } = useCustomer();
    console.log(customers);

    const stats = [
        {
            title: 'Total Customer',
            value: `${customers?.data?.length || 0}`,
            change: '+12%',
            trend: 'up',
            icon: <FiUsers className="text-blue-500" size={24} />,
            color: 'blue'
        },
        {
            title: 'Revenue',
            value: '$45,234',
            change: '+8%',
            trend: 'up',
            icon: <FiDollarSign className="text-green-500" size={24} />,
            color: 'green'
        },
        {
            title: 'Active Sessions',
            value: '1,234',
            change: '-3%',
            trend: 'down',
            icon: <FiActivity className="text-orange-500" size={24} />,
            color: 'orange'
        },
        {
            title: 'Conversion Rate',
            value: '4.5%',
            change: '+2%',
            trend: 'up',
            icon: <FiTrendingUp className="text-purple-500" size={24} />,
            color: 'purple'
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

const StatCard = ({ title, value, change, trend, icon, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-gray-600 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-${color}-50`}>
                {icon}
            </div>
        </div>
        <div className={`flex items-center text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
            <span className="font-medium">{change}</span>
            <span className="ml-1">from last week</span>
        </div>
    </div>
);

export default StatsGrid;