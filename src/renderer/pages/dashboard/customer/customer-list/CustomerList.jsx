import React from "react";
import { Link, useSearchParams } from "react-router";
import useCustomer from "../../../../hooks/useCustomer";
import { FaUserEdit, FaSave, FaTimes } from "react-icons/fa";
import { FcViewDetails } from "react-icons/fc";
import { MdGroupRemove } from "react-icons/md";
import { useState, useEffect } from "react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { usefucton } from "../../../../provider/FunctionProvider";

const CustomerList = () => {
    const { customers, isLoading, refetch } = useCustomer();
    const [searchParams, setSearchParams] = useSearchParams();
    const { customerdueNow } = usefucton()
    const axiosSecure = useAxiosSecure();
    const [customerFiltered, setCustomerFiltered] = useState([]);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [editFormData, setEditFormData] = useState({});

    useEffect(() => {
        if (customers && customers.data) {
            if (searchParams.get("search")) {
                const searchTerm = searchParams.get("search").toLowerCase();

                const filteredCustomers = customers.data.filter(customer =>
                    customer?.name?.toLowerCase().includes(searchTerm) ||
                    customer?.guardian?.toLowerCase().includes(searchTerm) ||
                    customer?.phone?.toLowerCase().includes(searchTerm)
                );

                setCustomerFiltered(filteredCustomers);
            } else {
                setCustomerFiltered(customers.data);
            }
        }
    }, [searchParams, customers]);

    // Auto-resize input function
    const resizeInput = (e) => {
        const input = e.target;
        input.style.width = 'auto';
        input.style.width = (input.scrollWidth + 10) + 'px';
    };

    const handleEditClick = (customer) => {
        setEditingCustomer(customer._id);
        setEditFormData({
            _id: customer._id || '',
            name: customer.name || '',
            guardian: customer.guardian || '',
            age: customer.age || '',
            phone: customer.phone || '',
            address: customer.address || ''
        });

        // Auto-resize inputs after a short delay to ensure they're rendered
        setTimeout(() => {
            const inputs = document.querySelectorAll('.resizable-input');
            inputs.forEach(input => {
                input.style.width = 'auto';
                input.style.width = (input.scrollWidth + 10) + 'px';
            });
        }, 10);
    };

    const handleCancelEdit = () => {
        setEditingCustomer(null);
        setEditFormData({});
    };

    const handleSaveEdit = async () => {
        console.log("Saving data:", editFormData);
        try {
            const { data } = await axiosSecure.put(`/customers/${editFormData?._id}`, editFormData);
            if (data?.updated > 0) {
                refetch();
                toast.success('Customer Update Successful ')
            }
        } catch (error) {
            toast.error(`${error.message}`)
        }

        setEditingCustomer(null);
        setEditFormData({});
    };

    const handleRemoved = async (_id) => {
        console.log(_id);
        // Add your remove logic here
        try {
            const { data } = await axiosSecure.delete(`/customers/${_id}`);
            if (data?.deletedCount > 0) {
                refetch();
                toast.success('Customer Removed Successfully');
            }
        } catch (error) {
            toast.error(`${error.message}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });

        // Auto-resize the input
        resizeInput(e);
    };

    if (isLoading) return <span className="loading loading-infinity loading-xl"></span>

    return (
        <div>
            {
                customerFiltered && customerFiltered.length > 0 ? <>
                    <div >
                        <table className="table table-xs">
                            <thead className="sticky top-0 z-30 ">
                                <tr className="bg-blue-600">
                                    <th></th>
                                    <th>Name</th>
                                    <th>Guardian</th>
                                    <th>Age</th>
                                    <th>Phone</th>
                                    <th>Address</th>
                                    <th>Total Due</th>
                                    <th>Action</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody className="overflow-x-auto">
                                {customerFiltered.map((customer, index) => {
                                    const actualDue = customerdueNow(customer._id);
                                    const totalDue = actualDue?.entries?.reduce((sum, entry) => sum + (entry.due || 0), 0);

                                    return <React.Fragment key={customer._id}>
                                        <tr className="hover:bg-gray-400 hover:font-semibold hover:text-sm hover:text-white">
                                            <th>{index + 1}</th>
                                            <td>{customer.name}</td>
                                            <td>{customer.guardian}</td>
                                            <td>{customer.age}</td>
                                            <td>{customer.phone}</td>
                                            <td>{customer.address}</td>
                                            <td>{totalDue}</td>
                                            <td className="flex gap-1.5">
                                                <button
                                                    onClick={() => handleEditClick(customer)}
                                                    className="btn btn-xs btn-primary"
                                                >
                                                    <FaUserEdit />
                                                </button>
                                                <button
                                                    onClick={() => handleRemoved(customer._id)}
                                                    className="btn btn-xs btn-outline hover:bg-red-700 hover:scale-125"
                                                >
                                                    <MdGroupRemove />
                                                </button>
                                            </td>
                                            <td><Link to={`/dashboard/customer-due-details/customer_id/${customer._id}`}><button className="btn btn-xs btn-outline hover:bg-blue-700 hover:scale-125"><FcViewDetails /></button></Link></td>
                                        </tr>

                                        {editingCustomer === customer._id && (
                                            <tr className="bg-blue-50">
                                                <td colSpan="9">
                                                    <div className="p-4 bg-blue-100 rounded-lg">
                                                        <h3 className="font-bold mb-2">Edit Customer</h3>
                                                        <div className="flex flex-wrap items-end gap-3 mb-3">
                                                            <div className="flex flex-col">
                                                                <label className="label py-0">
                                                                    <span className="label-text">Name</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={editFormData.name}
                                                                    onChange={handleInputChange}
                                                                    onKeyUp={resizeInput}
                                                                    className="resizable-input input input-bordered input-sm"
                                                                    style={{ width: '120px' }}
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <label className="label py-0">
                                                                    <span className="label-text">Guardian</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="guardian"
                                                                    value={editFormData.guardian}
                                                                    onChange={handleInputChange}
                                                                    onKeyUp={resizeInput}
                                                                    className="resizable-input input input-bordered input-sm"
                                                                    style={{ width: '120px' }}
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <label className="label py-0">
                                                                    <span className="label-text">Age</span>
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    name="age"
                                                                    value={editFormData.age}
                                                                    onChange={handleInputChange}
                                                                    className="input input-bordered input-sm w-16"
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <label className="label py-0">
                                                                    <span className="label-text">Phone</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="phone"
                                                                    value={editFormData.phone}
                                                                    onChange={handleInputChange}
                                                                    onKeyUp={resizeInput}
                                                                    className="resizable-input input input-bordered input-sm"
                                                                    style={{ width: '120px' }}
                                                                />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <label className="label py-0">
                                                                    <span className="label-text">Address</span>
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="address"
                                                                    value={editFormData.address}
                                                                    onChange={handleInputChange}
                                                                    onKeyUp={resizeInput}
                                                                    className="resizable-input input input-bordered input-sm"
                                                                    style={{ width: '200px' }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={handleSaveEdit}
                                                                className="btn btn-success btn-sm"
                                                            >
                                                                <FaSave /> Save
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="btn btn-error btn-sm"
                                                            >
                                                                <FaTimes /> Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
                    : <p>No Data Available</p>
            }
        </div>
    );
};

export default CustomerList;