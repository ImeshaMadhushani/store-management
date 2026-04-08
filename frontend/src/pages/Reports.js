import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { API } from "../api/api";

export default function Reports() {
    const [report, setReport] = useState([]);
    const [monthly, setMonthly] = useState([]);
    const [issues, setIssues] = useState([]);
    const [yearlyStock, setYearlyStock] = useState([]);
    const [yearlyIssues, setYearlyIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const res1 = await API.get("/stock/report");
            const res2 = await API.get("/stock/monthly");
            const res3 = await API.get("/issues/monthly");
            const res4 = await API.get("/stock/yearly");
            const res5 = await API.get("/issues/yearly");

            setReport(res1.data);
            setMonthly(res2.data);
            setIssues(res3.data);
            setYearlyStock(res4.data);
            setYearlyIssues(res5.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 text-lg">Loading dashboard...</p>
            </div>
        );
    }

    const totalIn = report.reduce((sum, item) => sum + item.total_in, 0);
    const totalOut = report.reduce((sum, item) => sum + item.total_out, 0);
    const balance = totalIn - totalOut;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Reports Dashboard</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm opacity-80">Total Stock In</h2>
                        <TrendingUp />
                    </div>
                    <p className="text-3xl font-bold mt-2">{totalIn}</p>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm opacity-80">Total Stock Out</h2>
                        <TrendingDown />
                    </div>
                    <p className="text-3xl font-bold mt-2">{totalOut}</p>
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm opacity-80">Balance</h2>
                        <Wallet />
                    </div>
                    <p className="text-3xl font-bold mt-2">{balance}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white shadow-lg rounded-2xl p-6 mb-12">
                <h2 className="text-lg font-semibold mb-4">Monthly Stock Overview</h2>
                <ResponsiveContainer width="100%" height={340}>
                    <BarChart data={monthly}
                        margin={{ top: 20, right: 20, left: 0, bottom: 30 }}>
                        <XAxis dataKey="month" tickMargin={10} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="total_added" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Table Component */}
            {/* {renderTable("Stock Summary", report, [
                "name",
                "total_in",
                "total_out",
                "balance",
            ])} */}

            {renderTable("Monthly Stock Added", monthly, [
                "month",
                "year",
                "name",
                "total_added",
            ])}

            {renderTable("Monthly Issued Stock", issues, [
                "month",
                "year",
                "name",
                "total_issued",
            ])}

            {renderTable("Yearly Stock Added", yearlyStock, [
                "year",
                "name",
                "total_added",
            ])}

            {renderTable("Yearly Issued Stock", yearlyIssues, [
                "year",
                "name",
                "total_issued",
            ])}
        </div>
    );
}

function renderTable(title, data, columns) {
    return (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 mb-8">
            <h2 className="p-4 text-lg font-semibold">{title}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i} className="p-3">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, i) => (
                                <tr key={i} className="border-t hover:bg-gray-50 transition">
                                    {columns.map((col, j) => (
                                        <td key={j} className="p-3">
                                            {row[col]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center p-4 text-gray-500">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
