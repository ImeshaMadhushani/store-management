import { useEffect, useState } from "react";
import StockForm from "../components/StockForm";
import { API } from "../api/api";

import {
    Boxes,
    RefreshCw,
    Pencil,
    Trash2
} from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Stock() {

    const [stock, setStock] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [monthFilter, setMonthFilter] = useState("all");

    const loadStock = async () => {

        try {

            setLoading(true);

            const res = await API.get("/stock/monthly");

            setStock(res.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadStock();
    }, []);

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this stock?"
        );

        if (!confirmDelete) return;

        try {

            await API.delete(`/stock/${id}`);

            alert("Stock Deleted Successfully");

            loadStock();

        } catch (err) {

            console.error(err);

            alert("Delete Failed");
        }
    };

    const handleEdit = async (s) => {

        const quantity = prompt(
            "Enter New Quantity",
            s.total_added
        );

        if (!quantity) return;

        try {

            await API.put(`/stock/${s.id}`, {
                item_id: s.item_id,
                quantity: Number(quantity),
                month: s.month,
                year: s.year
            });

            alert("Stock Updated Successfully");

            loadStock();

        } catch (err) {

            console.error(err);
            alert("Update Failed");
        }
    };

    const filteredStock = stock.filter((s) => {

        const matchesSearch = s.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesMonth =
            monthFilter === "all" ||
            s.month === monthFilter;

        return matchesSearch && matchesMonth;
    });

    const exportExcel = () => {

        const ws = XLSX.utils.json_to_sheet(filteredStock);

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Stock");

        XLSX.writeFile(wb, "Stock_Report.xlsx");
    };

    const exportPDF = () => {

        const doc = new jsPDF();

        doc.text("Stock Report", 14, 10);

        const tableData = filteredStock.map((s) => [
            s.month,
            s.year,
            s.name,
            s.total_added,
            s.created_at,
            s.updated_at
        ]);

        autoTable(doc, {
            head: [[
                "Month",
                "Year",
                "Item",
                "Quantity",
                "Created",
                "Updated"
            ]],
            body: tableData,
            startY: 20
        });

        doc.save("Stock_Report.pdf");
    };

    return (

        <div className="min-h-screen bg-gray-50 p-6">

            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

                <div>

                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Boxes size={22} />
                        Stock Management
                    </h1>

                    <p className="text-gray-500 text-sm">
                        {new Date().toLocaleDateString()}
                        {" | "}
                        {new Date().toLocaleTimeString()}
                    </p>

                </div>

                <div className="flex gap-2 flex-wrap">

                    <button
                        onClick={loadStock}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg"
                    >
                        <RefreshCw size={16} />
                    </button>

                    <button
                        onClick={exportExcel}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                        Excel
                    </button>

                    <button
                        onClick={exportPDF}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                        PDF
                    </button>

                </div>

            </div>

            {/* Filters */}

            <div className="flex flex-col md:flex-row gap-4 mb-6">

                <input
                    type="text"
                    placeholder="Search item..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border px-3 py-2 rounded-lg w-full md:w-1/3"
                />

                <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="border px-3 py-2 rounded-lg"
                >

                    <option value="all">
                        All Months
                    </option>

                    {[
                        "January",
                        "February",
                        "March",
                        "April",
                        "May",
                        "June",
                        "July",
                        "August",
                        "September",
                        "October",
                        "November",
                        "December"
                    ].map((m) => (

                        <option key={m} value={m}>
                            {m}
                        </option>

                    ))}

                </select>

            </div>

            {/* Form */}

            <div className="mb-8">
                <StockForm />
            </div>

            {/* Table */}

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

                <div className="p-4 border-b flex justify-between">

                    <h2 className="font-semibold">
                        Monthly Stock Records
                    </h2>

                    <span>
                        Total: {filteredStock.length}
                    </span>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="p-3 text-left">
                                    Month
                                </th>

                                <th className="p-3 text-left">
                                    Year
                                </th>

                                <th className="p-3 text-left">
                                    Item
                                </th>

                                <th className="p-3 text-left">
                                    Quantity
                                </th>

                                <th className="p-3 text-left">
                                    Created
                                </th>

                                <th className="p-3 text-left">
                                    Updated
                                </th>

                                <th className="p-3 text-left">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center p-6"
                                    >
                                        Loading...
                                    </td>

                                </tr>

                            ) : filteredStock.length > 0 ? (

                                filteredStock.map((s, i) => (

                                    <tr
                                        key={i}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-3">
                                            {s.month}
                                        </td>

                                        <td className="p-3">
                                            {s.year}
                                        </td>

                                        <td className="p-3 font-medium">
                                            {s.name}
                                        </td>

                                        <td className="p-3 text-green-600 font-semibold">
                                            {s.total_added}
                                        </td>

                                        <td className="p-3">
                                            {
                                                new Date(s.created_at)
                                                    .toLocaleString()
                                            }
                                        </td>

                                        <td className="p-3">
                                            {
                                                new Date(s.updated_at)
                                                    .toLocaleString()
                                            }
                                        </td>
                                        <td className="p-3 flex gap-2">

                                            <button
                                                onClick={() => handleEdit(s)}
                                                className="bg-blue-500 text-white p-2 rounded"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(s.id)}
                                                className="bg-red-500 text-white p-2 rounded"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center p-6"
                                    >
                                        No data found
                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}