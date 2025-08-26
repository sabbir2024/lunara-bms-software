import React from "react";

const CustomerSection = ({
    customerSearch, setCustomerSearch,
    selectedCustomer, setSelectedCustomer,
    manualCustomer, setManualCustomer,
    matchedCustomers
}) => {
    const handleCustomerSelect = (cust) => {
        setSelectedCustomer(cust);
        setCustomerSearch("");
        setManualCustomer({ name: "", guardian: "", age: "", phone: "" });
    };

    const handleAddManualCustomer = () => {
        const { name, guardian, age, phone } = manualCustomer;
        if (name && guardian && age && phone) {
            setSelectedCustomer(manualCustomer);
            setCustomerSearch("");
            setManualCustomer({ name: "", guardian: "", age: "", phone: "" });
        } else {
            alert("Please fill all manual customer fields");
        }
    };

    return (
        <div className="border p-4 rounded shadow-sm">
            <h2 className="text-lg font-bold mb-3">🧑‍💼 Customer Info</h2>
            {!selectedCustomer ? (
                <>
                    <input
                        type="text"
                        placeholder="Search customer by name..."
                        className="w-full border p-2 rounded"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                    {matchedCustomers?.length > 0 && customerSearch.trim() && (
                        <div className="mt-2 max-h-40 overflow-y-auto border rounded bg-white shadow">
                            {matchedCustomers.map((cust) => (
                                <p
                                    key={cust._id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleCustomerSelect(cust)}
                                >
                                    <span className="text-md font-bold italic ">{cust.name}</span>
                                    <span className="text-md font-bold italic ">({cust.phone})</span> Guardian
                                    <span className="text-md font-bold italic ">{cust.guardian} </span>
                                </p>
                            ))}
                        </div>
                    )}
                    {customerSearch && matchedCustomers?.length === 0 && (
                        <div className="mt-3 text-sm">
                            <p className="mb-1 text-gray-700">No customer found. Add manually:</p>
                            <input placeholder="Customer Name" className="w-full border p-2 rounded mt-1"
                                value={manualCustomer.name}
                                onChange={(e) => setManualCustomer((prev) => ({ ...prev, name: e.target.value }))} />
                            <input placeholder="Guardian Name" className="w-full border p-2 rounded mt-2"
                                value={manualCustomer.guardian}
                                onChange={(e) => setManualCustomer((prev) => ({ ...prev, guardian: e.target.value }))} />
                            <input placeholder="Age" type="number" className="w-full border p-2 rounded mt-2"
                                value={manualCustomer.age}
                                onChange={(e) => setManualCustomer((prev) => ({ ...prev, age: e.target.value }))} />
                            <input placeholder="Phone" className="w-full border p-2 rounded mt-2"
                                value={manualCustomer.phone}
                                onChange={(e) => setManualCustomer((prev) => ({ ...prev, phone: e.target.value }))} />
                            <button
                                onClick={handleAddManualCustomer}
                                className="bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700"
                            >
                                ➕ Add Customer
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold">{selectedCustomer.name}</p>
                        <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                        {selectedCustomer.guardian && <p className="text-sm text-gray-500">Guardian: {selectedCustomer.guardian}</p>}
                        {selectedCustomer.age && <p className="text-sm text-gray-500">Age: {selectedCustomer.age}</p>}
                    </div>
                    <button className="text-red-500 font-bold" onClick={() => setSelectedCustomer(null)}>✖ Change</button>
                </div>
            )}
        </div>
    );
};

export default CustomerSection;
