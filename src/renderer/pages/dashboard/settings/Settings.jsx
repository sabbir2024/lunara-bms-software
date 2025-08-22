import React, { useState } from 'react';
import useUsers from '../../../hooks/useUsers';
import ConfigEditor from '../../share/ConfigEditor';

// Customer Profile Modal Component
const CustomerProfileModal = ({ isOpen, onClose, customerData, onUpdate }) => {
    const { users } = useUsers()
    const [formData, setFormData] = useState(users);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">{users?.data?.name} Edit your Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name:
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData?.data?.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password:
                        </label>
                        <input
                            type="password"
                            name="password"
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password:
                        </label>
                        <input
                            type="password"
                            name="new_password"
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Agian Password:
                        </label>
                        <input
                            type="password"
                            name="new_again_password"
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone:
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData?.data?.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address:
                        </label>
                        <textarea
                            name="address"
                            value={formData?.data?.address}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                        />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Update Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Tree Node Component for Responsibility Requests
const TreeNode = ({ node, onCheckboxChange, selectedNodes }) => {
    const handleCheckboxChange = (e) => {
        onCheckboxChange(node.id, e.target.checked);
    };

    return (
        <div className="ml-4">
            <label className="flex items-center space-x-2 py-1 cursor-pointer">
                <input
                    type="checkbox"
                    checked={selectedNodes.includes(node.id)}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{node.name}</span>
            </label>
            {node.children && node.children.length > 0 && (
                <div className="ml-6 border-l-2 border-gray-200 pl-2">
                    {node.children.map(child => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            onCheckboxChange={onCheckboxChange}
                            selectedNodes={selectedNodes}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

// Main Settings Component
const Settings = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResponsibilities, setSelectedResponsibilities] = useState([]);
    const { users } = useUsers();
    // console.log(users.data);

    const [customerData, setCustomerData] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: '123 Main St, City, Country'
    });

    // Sample responsibility tree data
    const responsibilityTree = {
        id: 'root',
        name: 'All Responsibilities',
        children: [
            {
                id: 'finance',
                name: 'Finance',
                children: [
                    { id: 'budget', name: 'Budget Management' },
                    { id: 'expenses', name: 'Expense Approval' },
                    { id: 'reports', name: 'Financial Reports' }
                ]
            },
            {
                id: 'operations',
                name: 'Operations',
                children: [
                    { id: 'inventory', name: 'Inventory Management' },
                    { id: 'logistics', name: 'Logistics' },
                    { id: 'maintenance', name: 'Maintenance' }
                ]
            },
            {
                id: 'hr',
                name: 'Human Resources',
                children: [
                    { id: 'hiring', name: 'Hiring' },
                    { id: 'training', name: 'Training' },
                    { id: 'benefits', name: 'Benefits Administration' }
                ]
            }
        ]
    };

    const handleCheckboxChange = (nodeId, isChecked) => {
        setSelectedResponsibilities(prev => {
            if (isChecked) {
                return [...prev, nodeId];
            } else {
                return prev.filter(id => id !== nodeId);
            }
        });
    };

    const handleRequestResponsibilities = () => {
        // console.log('Requested Responsibilities:', selectedResponsibilities);

        const requestData = {
            customerId: customerData.email,
            requestedResponsibilities: selectedResponsibilities,
            timestamp: new Date().toISOString(),
            customerName: customerData.name
        };

        console.log('Responsibility Request Data:', requestData);

        setSelectedResponsibilities([]);
        alert('Responsibility request submitted! Check console for details.');
    };

    const handleUpdateProfile = (updatedData) => {
        setCustomerData(updatedData);
        console.log('Updated Customer Profile:', updatedData);
        setIsModalOpen(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Users Settings</h1>

            {/* Customer Profile Section */}
            <section className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Users Profile</h2>
                <div className="space-y-2 mb-4">
                    <p><strong className="text-gray-700">Name:</strong> {users?.data?.name}</p>
                    <p><strong className="text-gray-700">User ID:</strong> {users?.data?.userId}</p>
                    <p><strong className="text-gray-700">Role:</strong> {users?.data?.role}</p>
                    <p><strong className="text-gray-700">Phone:</strong> {users?.data?.phone}</p>
                    <p><strong className="text-gray-700">Address:</strong> {users?.data?.address}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Edit Profile
                </button>
            </section>
            <ConfigEditor />

            {/* Responsibility Request Section */}
            <section className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Request Responsibilities</h2>
                <p className="text-gray-600 mb-4">Select the responsibilities you want to request:</p>

                <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
                    <TreeNode
                        node={responsibilityTree}
                        onCheckboxChange={handleCheckboxChange}
                        selectedNodes={selectedResponsibilities}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        onClick={handleRequestResponsibilities}
                        disabled={selectedResponsibilities.length === 0}
                        className={`px-6 py-2 rounded-md transition-colors ${selectedResponsibilities.length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                    >
                        Request Selected Responsibilities
                    </button>

                    {selectedResponsibilities.length > 0 && (
                        <span className="text-sm text-gray-600">
                            Selected: {selectedResponsibilities.length} responsibilities
                        </span>
                    )}
                </div>
            </section>

            {/* Profile Modal */}
            <CustomerProfileModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                customerData={customerData}
                onUpdate={handleUpdateProfile}
            />
        </div>
    );
};

export default Settings;