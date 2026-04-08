import { useEffect, useState } from "react";
import StockForm from "../components/StockForm";
import { API } from "../api/api";

export default function Stock() {
    const [stock, setStock] = useState([]);

    const loadStock = async () => {
        const res = await API.get("/stock/monthly");
        setStock(res.data);
    };

    useEffect(() => {
        loadStock();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Stock Management</h1>

            {/* Add Stock Form */}
            <StockForm />

            {/* Stock Table */}
            <table className="w-full border mt-6">
                <thead className="bg-gray-200">
                    <tr>
                        <th>Month</th>
                        <th>Year</th>
                        <th>Item</th>
                        <th>Quantity</th>
                    </tr>
                </thead>

                <tbody>
                    {stock.map((s, i) => (
                        <tr key={i} className="text-center border">
                            <td>{s.month}</td>
                            <td>{s.year}</td>
                            <td>{s.name}</td>
                            <td>{s.total_added}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}