const CustomerTable = ({
    entries,
    expandedRows,
    toggleRowExpansion,
    totalPrice,
    totalPaid,
    sumDue,
    tableRef
}) => {
    return (
        <div className="overflow-x-auto mt-6 bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200" ref={tableRef}>
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GatePass No</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payments</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gate Pass By</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {entries.map((item, index) => {
                        const gatepass = item?.gatepassNo;
                        const isGatepass = gatepass?.startsWith("GP");
                        const isGatepassPAY = gatepass?.startsWith("PAY");

                        return (
                            <TableRow
                                key={index}
                                item={item}
                                index={index}
                                isGatepass={isGatepass}
                                isGatepassPAY={isGatepassPAY}
                                expandedRows={expandedRows}
                                toggleRowExpansion={toggleRowExpansion}
                            />
                        );
                    })}
                </tbody>
                <tfoot className="bg-gray-50">
                    <tr className="font-bold">
                        <td colSpan="3" className="px-4 py-3 text-right">Total:</td>
                        <td className="px-4 py-3">{totalPrice.toFixed(2)}</td>
                        <td className="px-4 py-3">{totalPaid.toFixed(2)}</td>
                        <td className="px-4 py-3">{sumDue.toFixed(2)}</td>
                        <td colSpan="2" className="px-4 py-3">{entries.length} entries</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

const TableRow = ({ item, index, isGatepass, isGatepassPAY, expandedRows, toggleRowExpansion }) => {
    return (
        <>
            <tr className={`hover:bg-gray-50 ${isGatepassPAY ? "text-blue-700" : ""}`}>
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">{item?.date}</td>
                <td className="px-4 py-3">{item?.gatepassNo}</td>
                <td className="px-4 py-3">{item?.total}</td>
                <td className="px-4 py-3">{item?.paid}</td>
                <td className="px-4 py-3">{item?.due}</td>
                <td className="px-4 py-3">{item?.updateByLoggedUser?.name}</td>
                <td className="px-4 py-3">
                    {isGatepass && (
                        <button
                            onClick={() => toggleRowExpansion(index)}
                            className="text-blue-500 hover:text-blue-700 font-medium"
                        >
                            {expandedRows[index] ? "Hide Products" : "Show Products"}
                        </button>
                    )}
                </td>
            </tr>
            {expandedRows[index] && isGatepass && item.products && (
                <tr>
                    <td colSpan="8" className="px-4 py-3">
                        <div className="bg-gray-100 p-4 rounded-lg">
                            <h4 className="font-bold mb-3 text-gray-700">Products:</h4>
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Generic</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Strength</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Manufacturer</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Qty</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {item.products.map((product, pIndex) => (
                                        <tr key={pIndex}>
                                            <td className="px-3 py-2">{product.name}</td>
                                            <td className="px-3 py-2">{product.generic}</td>
                                            <td className="px-3 py-2">{product.strength}</td>
                                            <td className="px-3 py-2">{product.manufacturer}</td>
                                            <td className="px-3 py-2">{product.qty}</td>
                                            <td className="px-3 py-2">{product.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default CustomerTable;