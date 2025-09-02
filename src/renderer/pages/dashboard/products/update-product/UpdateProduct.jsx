import React from 'react';

const UpdateProduct = ({ handleEditChange, editedProduct }) => {
    return (
        <tr className="bg-blue-50">
            <td colSpan="10" className="p-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h4 className="text-lg font-semibold mb-3">Edit Product</h4>
                    <div className="flex flex-wrap space-x-3 w-full">
                        <label className="floating-label">
                            <span>Product Name</span>
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={editedProduct.name || ''}
                                className="input input-xs w-auto"
                                onChange={(e) => handleEditChange('name', e.target.value)}
                            />
                        </label>
                        <label className="floating-label">
                            <span>Strength</span>
                            <input
                                type="text"
                                placeholder="Strength"
                                className="input input-xs w-16"
                                value={editedProduct.strength || ''}
                                onChange={(e) => handleEditChange('strength', e.target.value)}
                            />
                        </label>
                        <label className="floating-label">
                            <span>Generic Name</span>
                            <input
                                type="text"
                                placeholder="Generic Name"
                                className="input input-xs w-auto"
                                value={editedProduct.generic || ''}
                                onChange={(e) => handleEditChange('generic', e.target.value)}
                            />
                        </label>
                        <label className="floating-label">
                            <span>Manufacturer</span>
                            <input
                                type="text"
                                placeholder="Manufacturer"
                                className="input input-xs w-auto"
                                value={editedProduct.manufacturer || ''}
                                onChange={(e) => handleEditChange('manufacturer', e.target.value)}
                            />
                        </label>
                        <label className="floating-label">
                            <span>Cost</span>
                            <input
                                type="number"
                                placeholder="Cost"
                                className="input input-xs w-16"
                                value={editedProduct.cost || 0}
                                onChange={(e) => handleEditChange('cost', parseFloat(e.target.value))}
                            />
                        </label>
                        <label className="floating-label">
                            <span>Price</span>
                            <input
                                type="number"
                                placeholder="Price"
                                className="input input-xs w-16"
                                value={editedProduct.price || 0}
                                onChange={(e) => handleEditChange('price', parseFloat(e.target.value))}
                            />
                        </label>
                        <label className="floating-label">
                            <span>Quantity</span>
                            <input
                                type="number"
                                placeholder="Quantity"

                                className="input input-xs w-16" value={editedProduct.qty || 0}
                                onChange={(e) => handleEditChange('qty', parseInt(e.target.value))}
                            />
                        </label>
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default UpdateProduct;