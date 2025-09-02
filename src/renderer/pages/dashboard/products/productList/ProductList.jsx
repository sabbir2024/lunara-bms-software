import useProducts from "../../../../hooks/useProducts";
import { FaEdit, FaPlus, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import React, { useState } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import useUsers from "../../../../hooks/useUsers";
import AddProduct from "../add-product/AddProduct";
import UpdateProduct from "../update-product/UpdateProduct";

const ProductList = () => {
    const { isLoading, error, products, refetch } = useProducts();
    const [editingId, setEditingId] = useState(null);
    const [editedProduct, setEditedProduct] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        strength: "",
        generic: "",
        manufacturer: "",
        cost: 0,
        price: 0,
        qty: 0
    });
    const axiosSecure = useAxiosSecure();
    const { users } = useUsers();
    const [date, setDate] = useState(() => {
        const today = new Date().toISOString().split('T')[0];
        return today;
    });

    const [time, setTime] = useState(() => {
        const timeString = new Date().toISOString().split('T')[1];
        return timeString.split('.')[0]; // Removes milliseconds
    });

    // Sorting state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const updateBy = {
        name: users?.data?.name,
        userId: users?.data?.userId,
        time: time,
        date: date
    }

    // Sorting function
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Sorted products
    const sortedProducts = React.useMemo(() => {
        if (!products?.data) return [];

        let sortableItems = [...products.data];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [products, sortConfig]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-infinity loading-xl"></span>
            </div>
        );
    }

    const handleEdit = (product) => {
        setEditingId(product._id);
        setEditedProduct({ ...product, updateBy });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedProduct({});
    };

    const handleSaveEdit = async () => {
        const toastId = toast.loading('Loading...');
        const id = editedProduct?._id

        try {
            const { data } = await axiosSecure.put(`products/${id}`, editedProduct);

            if (data?.updated > 0) {
                toast.dismiss(toastId);
                toast.success(`Successfuly update to ${editedProduct?.name}`);
            }

        } catch (error) {
            toast.dismiss(toastId);
            toast.error(`${error?.message}`);
        }
        setEditingId(null);
        setEditedProduct({});
        refetch();
    };

    const handleEditChange = (field, value) => {
        setEditedProduct(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDelete = async (productId, productName) => {
        try {
            const { data } = await axiosSecure.delete(`/products/${productId}`)

            if (data?.deleted > 0) {
                toast.success(`${productName} is deleted from Database`)
            }
        } catch (error) {
            toast.error(error?.message)
        }
        console.log("Deleting product:", productId, productName);
        refetch();
    };

    const handleAddProduct = async () => {
        const newProductAdd = {
            ...newProduct, updateBy
        }
        try {
            const { data } = await axiosSecure.post('/products', newProductAdd);
            if (data?.success === true) {

                toast.success(`${newProduct?.name} is successfuly added to DataBase`)
            }
            console.log('res', data);

        } catch (error) {
            toast.error(error?.message)
        }
        console.log("Adding new product:", newProductAdd);
        setShowAddForm(false);
        setNewProduct({
            name: "",
            strength: "",
            generic: "",
            manufacturer: "",
            cost: 0,
            price: 0,
            qty: 0
        });
        refetch();
    };

    return (
        <div className="p-6">
            {/* Header with Add Button */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Product Inventory</h2>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <FaPlus /> Add Product
                </button>
            </div>

            {/* Add Product Form */}
            {showAddForm && (<AddProduct handleAddProduct={handleAddProduct} newProduct={newProduct} setNewProduct={setNewProduct} />

            )}

            {/* Products Table */}
            {
                products?.data?.length > 0 ?
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="table w-full table-xs">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-3 px-4">#</th>
                                    <th
                                        className="py-3 px-4 cursor-pointer hover:bg-gray-300"
                                        onClick={() => handleSort('name')}
                                    >
                                        Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-3 px-4">Strength</th>
                                    <th
                                        className="py-3 px-4 cursor-pointer hover:bg-gray-300"
                                        onClick={() => handleSort('generic')}
                                    >
                                        Category {sortConfig.key === 'generic' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-3 px-4">Company</th>
                                    <th
                                        className="py-3 px-4 cursor-pointer hover:bg-gray-300"
                                        onClick={() => handleSort('cost')}
                                    >
                                        Cost {sortConfig.key === 'cost' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th
                                        className="py-3 px-4 cursor-pointer hover:bg-gray-300"
                                        onClick={() => handleSort('price')}
                                    >
                                        Price {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th
                                        className="py-3 px-4 cursor-pointer hover:bg-gray-300"
                                        onClick={() => handleSort('qty')}
                                    >
                                        QTY {sortConfig.key === 'qty' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="py-3 px-4">Total Value</th>
                                    <th className="py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    sortedProducts.map((item, index) => {
                                        const totalPrice = item?.price * item?.qty;
                                        const isOutOfStock = item?.qty === 0 || item?.qty === null;
                                        const isEditing = editingId === item._id;

                                        return (
                                            <React.Fragment key={item._id}>
                                                <tr
                                                    className={`${isOutOfStock ? 'text-red-500 bg-red-50' : 'hover:bg-blue-50'} transition-colors ${isEditing ? 'bg-blue-100' : ''}`}
                                                >
                                                    <th >{index + 1}</th>
                                                    <td className=" font-medium">{item?.name}</td>
                                                    <td >{item?.strength}</td>
                                                    <td >{item?.generic}</td>
                                                    <td title={item?.manufacturer} >{item?.manufacturer?.split(' ')[0]}...</td>
                                                    <td >${item?.cost}</td>
                                                    <td >${item?.price}</td>
                                                    <td className={` font-semibold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                                                        {item?.qty || <p className="text-xs w-18">Out of stock</p>}
                                                    </td>
                                                    <td className=" font-bold">${totalPrice.toFixed(2)}</td>
                                                    <td >
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => isEditing ? handleSaveEdit() : handleEdit(item)}
                                                                className={`btn btn-sm ${isEditing ? 'btn-success' : 'btn-outline btn-info'}`}
                                                            >
                                                                {isEditing ? <FaSave /> : <FaEdit />}
                                                            </button>
                                                            <button
                                                                onClick={() => isEditing ? handleCancelEdit() : handleDelete(item._id, item?.name)}
                                                                className={`btn btn-sm ${isEditing ? 'btn-secondary' : 'btn-outline btn-error'}`}
                                                            >
                                                                {isEditing ? <FaTimes /> : <FaTrash />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Edit Form Row */}
                                                {isEditing && (
                                                    <UpdateProduct
                                                        handleEditChange={handleEditChange}
                                                        editedProduct={editedProduct} />
                                                )}
                                            </React.Fragment>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    :
                    <div className="alert alert-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>No products found. Add your first product!</span>
                    </div>
            }
        </div>
    );
};

export default ProductList;