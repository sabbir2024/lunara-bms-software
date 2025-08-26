import React from "react";

const ProductSection = ({
    productSearch, setProductSearch,
    matchedProducts, addedProducts, setAddedProducts
}) => {
    const handleProductSelect = (prod) => {
        const exists = addedProducts.find((p) => p._id === prod._id);
        if (!exists) {
            setAddedProducts((prev) => [...prev, { ...prod, qty: 1 }]);
        }
        setProductSearch("");
    };

    const updateQuantity = (id, qty) => {
        setAddedProducts((prev) =>
            prev.map((item) =>
                item._id === id ? { ...item, qty: Number(qty) } : item
            )
        );
    };

    const removeProduct = (id) => {
        setAddedProducts((prev) => prev.filter((item) => item._id !== id));
    };

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
                    {matchedProducts.map((prod) => (
                        <p
                            key={prod._id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleProductSelect(prod)}
                        >
                            {prod.name} — {prod.strength} — {prod.generic} — ৳{prod.price}
                        </p>
                    ))}
                </div>
            )}
            {addedProducts.length > 0 && (
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
                            {addedProducts.map((item, i) => (
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
