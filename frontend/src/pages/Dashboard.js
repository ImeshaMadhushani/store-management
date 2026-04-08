import { useEffect, useState } from "react";
import { API } from "../api/api";

export default function Dashboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await API.get("/stock/report");
        setData(res.data);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Stock Dashboard</h1>

            <table className="w-full border">
                <thead className="bg-gray-200">
                    <tr>
                        <th>Item</th>
                        <th>Total Stock In</th>
                        <th>Total Issued</th>
                        <th>Balance</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item) => (
                        <tr key={item.id} className="text-center border">
                            <td>{item.name}</td>
                            <td>{item.total_in}</td>
                            <td>{item.total_out}</td>
                            <td className="font-bold">{item.balance}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}