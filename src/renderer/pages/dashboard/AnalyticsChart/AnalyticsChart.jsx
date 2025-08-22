import React from 'react';
import { FiMenu, FiMoreVertical } from 'react-icons/fi';

// Analytics Chart Component
const AnalyticsChart = () => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Traffic Analytics</h3>
                <button className="text-gray-400 hover:text-gray-600">
                    <FiMenu size={20} />
                </button>
            </div>

            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📊</div>
                    <p>Chart visualization would be here</p>
                    <p className="text-sm">(Integrate with Chart.js or Recharts)</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
                <MetricItem label="Page Views" value="45.2K" change="+12.3%" />
                <MetricItem label="Unique Visitors" value="23.1K" change="+8.7%" />
                <MetricItem label="Bounce Rate" value="32.1%" change="-2.4%" />
            </div>
        </div>
    );
};

const MetricItem = ({ label, value, change }) => (
    <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-1">{label}</p>
        <p className={`text-xs font-medium mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
            {change}
        </p>
    </div>
);

export default AnalyticsChart;