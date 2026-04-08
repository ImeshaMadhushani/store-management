import { useEffect, useState } from "react";
import axios from "axios";

export default function Reports() {
    const [report, setReport] = useState([]);
    const [monthly, setMonthly] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res1 = await axios.get("http://localhost:5000/api/reports");
            const res2 = await axios.get("http://localhost:5000/api/reports/monthly");

            setReport(res1.data);
            setMonthly(res2.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="p-4">Loading reports...</p>;
    }

    // KPI Calculations
    const totalIn = report.reduce((sum, item) => sum + item.total_in, 0);
    const totalOut = report.reduce((sum, item) => sum + item.total_out, 0);
    const balance = totalIn - totalOut;

    return (
        <div className="p-4 md:p-6">
            <h1 className="text-2xl font-bold mb-4">Reports Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-500 text-white p-4 rounded shadow">
                    <h2>Total Stock In</h2>
                    <p className="text-xl font-bold">{totalIn}</p>
                </div>

                <div className="bg-red-500 text-white p-4 rounded shadow">
                    <h2>Total Stock Out</h2>
                    <p className="text-xl font-bold">{totalOut}</p>
                </div>

                <div className="bg-blue-500 text-white p-4 rounded shadow">
                    <h2>Balance</h2>
                    <p className="text-xl font-bold">{balance}</p>
                </div>
            </div>

            {/* Main Report Table */}
            <div className="bg-white shadow rounded overflow-x-auto mb-6">
                <h2 className="p-4 font-semibold">Stock Summary</h2>
                <table className="w-full text-left">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2">Item</th>
                            <th className="p-2">Stock In</th>
                            <th className="p-2">Stock Out</th>
                            <th className="p-2">Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map((item) => (
                            <tr key={item.id} className="border-t">
                                <td className="p-2">{item.name}</td>
                                <td className="p-2 text-green-600">{item.total_in}</td>
                                <td className="p-2 text-red-600">{item.total_out}</td>
                                <td className="p-2 font-bold">{item.balance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Monthly Report */}
            <div className="bg-white shadow rounded overflow-x-auto">
                <h2 className="p-4 font-semibold">Monthly Stock Added</h2>
                <table className="w-full text-left">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-2">Month</th>
                            <th className="p-2">Year</th>
                            <th className="p-2">Item</th>
                            <th className="p-2">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {monthly.map((item, index) => (
                            <tr key={index} className="border-t">
                                <td className="p-2">{item.month}</td>
                                <td className="p-2">{item.year}</td>
                                <td className="p-2">{item.name}</td>
                                <td className="p-2 text-blue-600">{item.total_added}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}