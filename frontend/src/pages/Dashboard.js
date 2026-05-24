import { useEffect, useState } from "react";
import { API } from "../api/api";
import Header from "../components/Header";

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await API.get("/stock/report");
        setData(res.data);
    };

    // 🔍 Filter + Search Logic
    const filteredData = data.filter((item) => {
        const matchesSearch = item.name
            .toLowerCase()
            .includes(search.toLowerCase());

        if (filter === "low") return item.balance < 10 && matchesSearch;
        if (filter === "out") return item.balance === 0 && matchesSearch;

        return matchesSearch;
    });

    // 📊 KPI Calculations
    /* const totalItems = data.length;
    const totalStock = data.reduce((sum, i) => sum + i.balance, 0);
    const lowStock = data.filter((i) => i.balance < 10).length;
 */
    return (
    <div className="min-h-screen bg-gray-50">
            <Header />

        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Stock Dashboard</h1>

            {/* 🔥 KPI Cards */}
           {/*  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-500 text-white p-4 rounded shadow">
                    <h2>Total Items</h2>
                    <p className="text-xl font-bold">{totalItems}</p>
                </div>

                <div className="bg-green-500 text-white p-4 rounded shadow">
                    <h2>Total Stock</h2>
                    <p className="text-xl font-bold">{totalStock}</p>
                </div>

                <div className="bg-red-500 text-white p-4 rounded shadow">
                    <h2>Low Stock Items</h2>
                    <p className="text-xl font-bold">{lowStock}</p>
                </div>
            </div> */}

            {/* 🔍 Search + Filter */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <input
                    type="text"
                    placeholder="Search items..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 rounded w-full md:w-1/3"
                />

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="all">All Items</option>
                    <option value="low">Low Stock (&lt;10)</option>
                    <option value="out">Out of Stock</option>
                </select>
            </div>

            {/* 📋 Table */}
            <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="p-3">Item</th>
                            <th className="p-3">Stock In</th>
                            <th className="p-3">Issued</th>
                            <th className="p-3">Balance</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredData.map((item) => (
                            <tr key={item.id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{item.name}</td>
                                <td className="p-3 text-green-600">
                                    {item.total_in}
                                </td>
                                <td className="p-3 text-red-600">
                                    {item.total_out}
                                </td>
                                <td className="p-3 font-bold">
                                    {item.balance}
                                </td>
                                <td className="p-3">
                                    {item.balance === 0 ? (
                                        <span className="text-red-600 font-semibold">
                                            Out of Stock
                                        </span>
                                    ) : item.balance < 10 ? (
                                        <span className="text-yellow-600 font-semibold">
                                            Low
                                        </span>
                                    ) : (
                                        <span className="text-green-600 font-semibold">
                                            Good
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredData.length === 0 && (
                    <p className="text-center p-4 text-gray-500">
                        No items found
                    </p>
                )}
            </div>
            </div>
        </div>
    );
}