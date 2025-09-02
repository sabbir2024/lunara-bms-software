import React from "react";

const ProductSection = ({
    productSearch, setProductSearch,
    matchedProducts, addedProducts, setAddedProducts
}) => {
    const handleProductSelect = (prod) => {
        // Check if product quantity is 0 or null/undefined
        if (prod.qty === 0 || prod.qty === null || prod.qty === undefined) {
            return; // Don't add the product
        }

        const exists = addedProducts.find((p) => p._id === prod._id);
        if (!exists) {
            setAddedProducts((prev) => [...prev, { ...prod, qty: 1 }]);
        }
        setProductSearch("");
    };

    const updateQuantity = (id, qty) => {
        const quantity = Number(qty);

        if (quantity <= 0) {
            // If quantity is 0 or less, remove the product
            setAddedProducts((prev) => prev.filter((item) => item._id !== id));
        } else {
            // Otherwise update the quantity
            setAddedProducts((prev) =>
                prev.map((item) =>
                    item._id === id ? { ...item, qty: quantity } : item
                )
            );
        }
    };

    const removeProduct = (id) => {
        setAddedProducts((prev) => prev.filter((item) => item._id !== id));
    };

    // Filter out products with quantity 0
    const visibleProducts = addedProducts.filter(item => item.qty > 0);

    return (
        <div className="border p-4 rounded shadow-sm">
            <h2 className="text-lg font-bold mb-3">🛒 Products</h2>
            <input
                type="text"
                placeholder="Search product..."
                className="w-full border p-2 rounded"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
            />
            {matchedProducts?.length > 0 && productSearch.trim() && (
                <div className="mt-2 max-h-40 overflow-y-auto border rounded bg-white shadow">
                    {matchedProducts.map((prod) => {
                        const alreadyAdded = addedProducts.find(p => p._id === prod._id);
                        // Check if product quantity is 0 or null/undefined
                        const isOutOfStock = prod.qty === 0 || prod.qty === null || prod.qty === undefined;

                        return (
                            <div
                                key={prod._id}
                                className={`p-2 cursor-pointer ${alreadyAdded || isOutOfStock
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'hover:bg-gray-100'
                                    }`}
                                onClick={() => !alreadyAdded && !isOutOfStock && handleProductSelect(prod)}
                            >
                                {prod.name} — {prod.strength} — {prod.generic} — ৳{prod.price} — QYT{prod.qty}
                                {alreadyAdded && <span className="text-xs text-blue-500 ml-2">(Already added)</span>}
                                {isOutOfStock && <span className="text-xs text-red-500 ml-2">(Out of stock)</span>}
                            </div>
                        );
                    })}
                </div>
            )}
            {visibleProducts.length > 0 && (
                <div className="mt-4 overflow-x-auto">
                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">#</th>
                                <th className="border p-2">Product</th>
                                <th className="border p-2">Qty</th>
                                <th className="border p-2">Price</th>
                                <th className="border p-2">Total</th>
                                <th className="border p-2">❌</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleProducts.map((item, i) => (
                                <tr key={item._id}>
                                    <td className="border p-2">{i + 1}</td>
                                    <td className="border p-2">{item.name}</td>
                                    <td className="border p-2">
                                        <input
                                            type="number"
                                            min={1}
                                            value={item.qty}
                                            className="w-16 border p-1 rounded"
                                            onChange={(e) => updateQuantity(item._id, e.target.value)}
                                        />
                                    </td>
                                    <td className="border p-2">৳{item.price}</td>
                                    <td className="border p-2">৳{item.price * item.qty}</td>
                                    <td className="border p-2 text-center">
                                        <button
                                            className="text-red-600"
                                            onClick={() => removeProduct(item._id)}
                                        >
                                            ✖
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ProductSection;