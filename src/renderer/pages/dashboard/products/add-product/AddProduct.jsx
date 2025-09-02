import React, { useState } from 'react';

const AddProduct = ({ handleAddProduct, newProduct, setNewProduct, setShowAddForm }) => {
    return (
        <div className="bg-gray-100 p-6 rounded-lg mb-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Product</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newProduct.type || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                    >
                        <option value="">Select Type</option>
                        <option value="Drug">Drug</option>
                        <option value="Cosmetic">Cosmetic</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                    <input
                        type="text"
                        placeholder="Product Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newProduct.name || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
                    <input
                        type="text"
                        placeholder="Strength"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newProduct.strength || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, strength: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
                    <input
                        type="text"
                        placeholder="Generic Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newProduct.generic || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, generic: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                    <input
                        type="text"
                        placeholder="Manufacturer"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newProduct.manufacturer || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, manufacturer: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                    <input
                        type="number"
                        placeholder="Cost"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newProduct.cost || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, cost: parseFloat(e.target.value) || 0 })}
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                        type="number"
                        placeholder="Price"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newProduct.price || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })}
                    />
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                        type="number"
                        placeholder="Quantity"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newProduct.qty || ''}
                        onChange={(e) => setNewProduct({ ...newProduct, qty: parseInt(e.target.value) || 0 })}
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                    Cancel
                </button>
                <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    Save Product
                </button>
            </div>
        </div>
    );
};

export default AddProduct;