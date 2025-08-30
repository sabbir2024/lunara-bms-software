import { MdDetails } from 'react-icons/md';

const DueProducts = ({ index, item }) => {
    console.log(item?.gatepassNo);

    // Calculate total amount
    const totalAmount = item?.products?.reduce((sum, product) => {
        return sum + (product?.qty * product?.price);
    }, 0) || 0;

    return (
        <div>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button className="btn" onClick={() => document.getElementById(index).showModal()}><MdDetails /></button>
            <dialog id={index} className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle text-black btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className="overflow-x-auto">
                        <table className="table table-xs text-black">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item?.products?.map((p, index) => (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>{p?.name} {p?.strength}</td>
                                        <td>{p?.price}</td>
                                        <td>{p?.qty}</td>
                                        <td>{p?.qty * p?.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                            {/* Footer with total amount */}
                            <tfoot>
                                <tr className="bg-gray-100 font-bold">
                                    <td colSpan="4" className="text-right">Grand Total:</td>
                                    <td>{totalAmount}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default DueProducts;