const ManuallyAdd = ({ newProduct, setNewProduct, filteredUnits, handleAddNewProduct }) => {

    // Function to generate batch number from product name
    const generateBatchNumber = (productName) => {
        if (!productName.trim()) return '';

        const timestamp = new Date().getTime().toString().slice(-4);
        const initials = productName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join('')
            .slice(0, 3);

        return `${initials}-${timestamp}`;
    };

    // Handle product name change
    const handleProductNameChange = (e) => {
        const productName = e.target.value;
        setNewProduct(prev => ({
            ...prev,
            product_name: productName,
            batch: generateBatchNumber(productName)
        }));
    };

    return (
        <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Add New Product Manually</h3>
            <div className="space-y-4">
                {/* Product Name and Generic Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-black">Product Name *</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter product name"
                            className="input input-bordered"
                            value={newProduct.product_name}
                            onChange={handleProductNameChange}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-black">Generic Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter generic name"
                            className="input input-bordered"
                            value={newProduct.generic}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, generic: e.target.value }))}
                        />
                    </div>
                </div>

                {/* Company and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-black">Company Name *</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter company name"
                            className="input input-bordered"
                            value={newProduct.company}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, company: e.target.value }))}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-black">Category</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter category"
                            className="input input-bordered"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                        />
                    </div>
                </div>

                {/* Product Group and Batch Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-black">Product Group</span>
                        </label>
                        <select
                            className="select select-bordered"
                            value={newProduct.product_group}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, product_group: e.target.value }))}
                        >
                            <option value="">Select group</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Food & Beverage">Food & Beverage</option>
                            <option value="Pharmacy">Pharmacy</option>
                            <option value="Cosmetics">Cosmetics</option>
                            <option value="Home & Garden">Home & Garden</option>
                            <option value="Sports & Fitness">Sports & Fitness</option>
                            <option value="Automotive">Automotive</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-black">Batch Number</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Auto-generated from product name"
                            className="input input-bordered bg-base-200"
                            value={newProduct.batch}
                            readOnly
                            disabled
                        />
                        <label className="label">
                            <span className="label-text-alt text-gray-500">Auto-generated from product name</span>
                        </label>
                    </div>
                </div>

                {/* Cost, Price, and Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-black">Cost (৳)</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="input input-bordered"
                            value={newProduct.cost}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, cost: e.target.value }))}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-black">Price (৳)</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            className="input input-bordered"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                        />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-black">Quantity</span>
                        </label>
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            className="input input-bordered"
                            value={newProduct.qty}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, qty: e.target.value }))}
                        />
                    </div>
                </div>

                {/* Unit Selection */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-black">Select Unit *</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {filteredUnits.map((unit) => (
                            <label
                                key={unit.value}
                                className="cursor-pointer label justify-start gap-3 p-3 border border-base-300 rounded-box hover:bg-base-200 transition-colors"
                            >
                                <input
                                    type="radio"
                                    name="unit"
                                    value={unit.value}
                                    checked={newProduct.unit === unit.value}
                                    onChange={(e) => setNewProduct(prev => ({ ...prev, unit: e.target.value }))}
                                    className="radio radio-primary"
                                />
                                <span className="label-text text-black ">{unit.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Date Display (Auto-generated, read-only) */}
                <div className="form-control">
                    <label className="label">
                        <span className="label-text text-black">Date Added</span>
                    </label>
                    <input
                        type="text"
                        className="input input-bordered bg-base-200"
                        value={newProduct.date || new Date().toLocaleDateString()}
                        readOnly
                        disabled
                    />
                    <label className="label">
                        <span className="label-text-alt text-gray-500">This field is auto-generated</span>
                    </label>
                </div>

                <button
                    onClick={handleAddNewProduct}
                    disabled={!newProduct.product_name?.trim() || !newProduct.company?.trim() || !newProduct.unit}
                    className="btn btn-primary btn-block gap-2"
                >
                    <span>➕</span>
                    Add New Product
                </button>
            </div>
        </div>
    );
};

export default ManuallyAdd;