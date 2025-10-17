import React, { useState } from 'react';
import useProducts from '../../../../hooks/useProducts';
import Header from '../../../../../components/Header';
import ManuallyAdd from './ManuallyAdd';

const ProductRec = () => {
    const { isLoading, products } = useProducts();

    const [productSearch, setProductSearch] = useState('');
    const [importerName, setImporterName] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [batch] = useState(generateBatchId());
    const [showSuggestions, setShowSuggestions] = useState(false);

    // New product input fields
    const [newProduct, setNewProduct] = useState({
        product_name: '',
        generic: '',
        company: '',
        category: '',
        product_group: '',
        cost: '',
        price: '',
        qty: '',
        batch: '',
        date: new Date().toLocaleDateString(),
        unit: ''
    });

    // Unit options
    const unitOptions = [
        { value: 'pcs', label: 'Pieces (pcs)', group: 'general' },
        { value: 'box', label: 'Box', group: 'general' },
        { value: 'pack', label: 'Pack', group: 'general' },
        { value: 'set', label: 'Set', group: 'general' },
        { value: 'kg', label: 'Kilogram (kg)', group: 'general' },
        { value: 'gm', label: 'Gram (gm)', group: 'general' },
        { value: 'ltr', label: 'Liter (ltr)', group: 'general' },
        { value: 'ml', label: 'Milliliter (ml)', group: 'general' },
        { value: 'tablet', label: 'Tablet', group: 'pharmacy' },
        { value: 'capsule', label: 'Capsule', group: 'pharmacy' },
        { value: 'bottle', label: 'Bottle', group: 'pharmacy' },
        { value: 'tube', label: 'Tube', group: 'cosmetic' },
        { value: 'jar', label: 'Jar', group: 'cosmetic' },
        { value: 'bottle_ml', label: 'Bottle (ml)', group: 'cosmetic' }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content font-medium">Loading products...</p>
                </div>
            </div>
        );
    }

    const productFinder = products?.data?.filter((prod) =>
        prod?.name?.toLowerCase().includes(productSearch.toLowerCase())
    ) || [];

    const handleProductSelect = (product) => {
        const existingProduct = selectedProducts.find(p => p._id === product._id);

        if (!existingProduct) {
            setSelectedProducts(prev => [...prev, {
                ...product,
                quantity: 1,
                receivedQuantity: 0
            }]);
        }

        setProductSearch('');
        setShowSuggestions(false);
    };

    const handleQuantityChange = (productId, newQuantity) => {
        setSelectedProducts(prev =>
            prev.map(product =>
                product._id === productId
                    ? { ...product, quantity: Math.max(0, newQuantity) }
                    : product
            )
        );
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts(prev =>
            prev.filter(product => product._id !== productId)
        );
    };

    const handleAddNewProduct = () => {
        if (newProduct.name.trim() && newProduct.company.trim()) {
            const productToAdd = {
                _id: `new-${Date.now()}`,
                name: newProduct.name.trim(),
                company: newProduct.company.trim(),
                group: newProduct.group,
                price: newProduct.price,
                description: newProduct.description,
                unit: newProduct.unit,
                isNew: true,
                quantity: 1,
                receivedQuantity: 0
            };

            setSelectedProducts(prev => [...prev, productToAdd]);
            // Reset form
            setNewProduct({
                name: '',
                company: '',
                group: '',
                price: '',
                description: '',
                unit: 'pcs'
            });
            setShowSuggestions(false);
        }
    };

    const totalItems = selectedProducts.reduce((sum, product) => sum + product.quantity, 0);
    const totalValue = selectedProducts.reduce((sum, product) => sum + (product.quantity * (parseFloat(product.price) || 0)), 0);

    // Filter units by group
    const getFilteredUnits = () => {
        if (newProduct.group === 'Pharmacy') {
            return unitOptions.filter(unit => unit.group === 'pharmacy' || unit.group === 'general');
        } else if (newProduct.group === 'Cosmetics') {
            return unitOptions.filter(unit => unit.group === 'cosmetic' || unit.group === 'general');
        }
        return unitOptions.filter(unit => unit.group === 'general');
    };

    const filteredUnits = getFilteredUnits();

    return (
        <>
            <Header
                searching={false}
                sectionName={'📦 Product Receiving'} />
            <div className="min-h-screen bg-base-200">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5"></div>

                <div className="relative max-w-7xl mx-auto p-6 space-y-8">
                    {/* Main Layout */}
                    <div>


                        {/* Main Content */}
                        <div className="lg:col-span-3 space-y-6">
                            {/* Importer Card */}
                            <div className="card bg-base-100 shadow-xl border border-base-300">
                                <div className="card-body">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text text-black font-semibold">Importer Name *</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter importer name..."
                                                className="input input-bordered"
                                                value={importerName}
                                                onChange={(e) => setImporterName(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Address *</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter address..."
                                                className="input input-bordered"
                                            />
                                        </div>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-semibold">Contact Number</span>
                                            </label>
                                            <input
                                                type="tel"
                                                placeholder="+8801XXXXXXXXX"
                                                className="input input-bordered"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search Card */}
                            <div className="card bg-base-100 shadow-xl border border-base-300">
                                <div className="card-body">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text text-black font-semibold">Quick Search Existing Products</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search existing products..."
                                                className="input input-bordered input-lg w-full pr-16"
                                                value={productSearch}
                                                onChange={(e) => {
                                                    setProductSearch(e.target.value);
                                                    setShowSuggestions(true);
                                                }}
                                                onFocus={() => setShowSuggestions(true)}
                                            />
                                            <button className="absolute right-2 top-2 btn btn-ghost btn-sm">
                                                🔍
                                            </button>
                                        </div>

                                        {/* Search Suggestions */}
                                        {showSuggestions && productSearch && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 border border-base-300 rounded-box shadow-2xl z-20 max-h-80 overflow-y-auto">
                                                {productFinder.length > 0 ? (
                                                    <div className="menu menu-compact w-full p-2">
                                                        {productFinder.slice(0, 5).map((item) => (
                                                            <li key={item?._id}>
                                                                <a onClick={() => handleProductSelect(item)}>
                                                                    <div>
                                                                        <h3 className="font-semibold">{item?.name}</h3>
                                                                        <p className="text-sm opacity-70">
                                                                            {item?.company && `Company: ${item.company}`}
                                                                        </p>
                                                                        {item?.unit && (
                                                                            <p className="text-xs text-primary mt-1">
                                                                                Unit: {item.unit}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <ManuallyAdd
                                                        newProduct={newProduct}
                                                        setNewProduct={setNewProduct}
                                                        filteredUnits={filteredUnits}
                                                        handleAddNewProduct={handleAddNewProduct} />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Selected Products Table */}
                            <div className="card bg-base-100 shadow-xl border border-base-300">
                                <div className="card-body">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <h2 className="card-title text-lg">
                                            📋 Selected Products
                                            <div className="badge badge-primary badge-lg">{selectedProducts.length}</div>
                                        </h2>

                                        {selectedProducts.length > 0 && (
                                            <button
                                                className="btn btn-success gap-2"
                                                onClick={() => {
                                                    console.log({
                                                        batch,
                                                        importerName,
                                                        products: selectedProducts
                                                    });
                                                }}
                                            >
                                                <span>✅</span>
                                                Complete Receiving
                                            </button>
                                        )}
                                    </div>

                                    {selectedProducts.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="table table-zebra table-auto w-full">
                                                <thead>
                                                    <tr className="bg-base-200">
                                                        <th className="text-left">#</th>
                                                        <th className="text-left">Product Name</th>
                                                        <th className="text-left">Company</th>
                                                        <th className="text-left">Group</th>
                                                        <th className="text-left">Unit</th>
                                                        <th className="text-left">Price</th>
                                                        <th className="text-left">Quantity</th>
                                                        <th className="text-left">Total</th>
                                                        <th className="text-left">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedProducts.map((product, index) => {
                                                        const productTotal = product.quantity * (parseFloat(product.price) || 0);
                                                        return (
                                                            <tr key={product._id} className="hover">
                                                                <td className="font-medium">{index + 1}</td>
                                                                <td>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-semibold">{product.name}</span>
                                                                        {product.isNew && (
                                                                            <span className="badge badge-success badge-sm">New</span>
                                                                        )}
                                                                    </div>
                                                                    {product.description && (
                                                                        <p className="text-xs opacity-70 mt-1 truncate max-w-xs">
                                                                            {product.description}
                                                                        </p>
                                                                    )}
                                                                </td>
                                                                <td>{product.company}</td>
                                                                <td>
                                                                    {product.group ? (
                                                                        <span className="badge badge-outline badge-info">
                                                                            {product.group}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="opacity-50">-</span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <span className="badge badge-outline badge-secondary">
                                                                        {product.unit}
                                                                    </span>
                                                                </td>
                                                                <td className="font-semibold text-success">
                                                                    {product.price ? `৳${parseFloat(product.price).toFixed(2)}` : '৳0.00'}
                                                                </td>
                                                                <td>
                                                                    <div className="join">
                                                                        <button
                                                                            onClick={() => handleQuantityChange(product._id, product.quantity - 1)}
                                                                            className="btn btn-sm join-item btn-outline"
                                                                        >
                                                                            −
                                                                        </button>
                                                                        <input
                                                                            type="number"
                                                                            min="0"
                                                                            value={product.quantity}
                                                                            onChange={(e) => handleQuantityChange(product._id, parseInt(e.target.value) || 0)}
                                                                            className="input input-sm input-bordered join-item w-16 text-center"
                                                                        />
                                                                        <button
                                                                            onClick={() => handleQuantityChange(product._id, product.quantity + 1)}
                                                                            className="btn btn-sm join-item btn-outline"
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                                <td className="font-bold text-warning">
                                                                    ৳{productTotal.toFixed(2)}
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        onClick={() => handleRemoveProduct(product._id)}
                                                                        className="btn btn-ghost btn-xs text-error"
                                                                        title="Remove product"
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                                <tfoot className="bg-base-200">
                                                    <tr>
                                                        <td colSpan={12} className="p-0">
                                                            <div className="grid grid-cols-4 gap-4 p-3">
                                                                <div className="text-center">
                                                                    <div className="font-bold">Total Products</div>
                                                                    <div>{selectedProducts.length}</div>
                                                                </div>
                                                                <div className="text-center text-primary">
                                                                    <div className="font-bold">New Products</div>
                                                                    <div>{selectedProducts.filter(p => p.isNew).length}</div>
                                                                </div>
                                                                <div className="text-center">
                                                                    <div className="font-bold">Total Items</div>
                                                                    <div>{totalItems}</div>
                                                                </div>
                                                                <div className="text-center text-warning">
                                                                    <div className="font-bold">Grand Total</div>
                                                                    <div>৳{totalValue.toFixed(2)}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="text-6xl mb-4 opacity-50">📦</div>
                                            <h3 className="text-xl font-semibold opacity-70 mb-2">
                                                No products selected yet
                                            </h3>
                                            <p className="opacity-50">
                                                Search existing products or add new products manually
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// Batch generator function
const generateBatchId = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `BATCH-${year}${month}${day}-${hours}${minutes}${seconds}`;
};

export default ProductRec;