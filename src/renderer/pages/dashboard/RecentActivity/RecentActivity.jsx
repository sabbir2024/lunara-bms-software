import React from 'react';
import { FiUser, FiShoppingCart, FiMessageSquare, FiSettings } from 'react-icons/fi';

// Recent Activity Component
const RecentActivity = () => {
    const activities = [
        {
            icon: <FiUser className="text-blue-500" />,
            title: 'New user registered',
            description: 'John Doe joined the platform',
            time: '2 minutes ago'
        },
        {
            icon: <FiShoppingCart className="text-green-500" />,
            title: 'New order placed',
            description: 'Order #1234 was created',
            time: '15 minutes ago'
        },
        {
            icon: <FiMessageSquare className="text-purple-500" />,
            title: 'New message received',
            description: 'You have a new message from Sarah',
            time: '1 hour ago'
        },
        {
            icon: <FiSettings className="text-orange-500" />,
            title: 'Settings updated',
            description: 'System settings were modified',
            time: '2 hours ago'
        }
    ];

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-blue-600 text-sm font-medium">View All</button>
            </div>

            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <ActivityItem key={index} {...activity} />
                ))}
            </div>
        </div>
    );
};

const ActivityItem = ({ icon, title, description, time }) => (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="p-2 bg-gray-100 rounded-lg">
            {icon}
        </div>
        <div className="flex-1">
            <h4 className="font-medium text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600">{description}</p>
            <p className="text-xs text-gray-400 mt-1">{time}</p>
        </div>
    </div>
);

export default RecentActivity;