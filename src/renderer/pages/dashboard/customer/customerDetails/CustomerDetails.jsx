import { useLoaderData } from "react-router";

const CustomerDetails = () => {
    const data = useLoaderData()
    console.log(data);

    return (
        <div>
            {
                data ?
                    <>
                        <div className="overflow-x-auto">
                            <table className="table table-xs">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Date</th>
                                        <th>GatePass No</th>
                                        <th>Total</th>
                                        <th>Payments</th>
                                        <th>Due</th>
                                        <th>Gate Pass By</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data[0]?.entries?.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-400 hover:font-semibold hover:text-sm hover:text-white">
                                                <th>{index + 1}</th>
                                                <td>{item?.date}</td>
                                                <td>{item?.gatepassNo}</td>
                                                <td>{item?.total}</td>
                                                <td>{item?.paid}</td>
                                                <td>{item?.due}</td>
                                                <td>{item?.updateByLoggedUser?.name}</td>
                                            </tr>)
                                        )
                                    }


                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-200 font-bold">
                                        <th colSpan="3" className="text-right">Total:</th>
                                        <th>
                                            {data[0]?.entries?.reduce((sum, item) => sum + (item?.total || 0), 0)}
                                        </th>
                                        <th>
                                            {data[0]?.entries?.reduce((sum, item) => sum + (item?.paid || 0), 0)}
                                        </th>
                                        <th>
                                            {data[0]?.entries?.reduce((sum, item) => sum + (item?.due || 0), 0)}
                                        </th>
                                        <th colSpan="2">
                                            {data[0]?.entries?.length} entries
                                        </th>
                                    </tr>
                                </tfoot>

                            </table>
                        </div>
                    </>
                    :
                    <p>Data Not Found</p>
            }
        </div>
    );
};

export default CustomerDetails;