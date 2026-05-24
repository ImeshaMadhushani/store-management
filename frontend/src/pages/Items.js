import { useEffect, useState } from "react";
import ItemForm from "../components/ItemForm";
import { API } from "../api/api";
import {
    Package,
    RefreshCw,
    Pencil,
    Trash2
} from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Items() {

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [unitFilter, setUnitFilter] = useState("all");

    const loadItems = async () => {
        try {
            setLoading(true);

            const res = await API.get("/items");

            setItems(res.data);

        } catch (err) {
            console.error(err);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleDelete = async (id) => {

        if (window.confirm("Delete this item?")) {

            try {
                await API.delete(`/items/${id}`);

                loadItems();

            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleEdit = async (item) => {

        const name = prompt("Enter New Item Name", item.name);

        const unit = prompt("Enter New Unit", item.unit);

        if (!name || !unit) return;

        try {

            await API.put(`/items/${item.id}`, {
                name,
                unit
            });

            loadItems();

        } catch (err) {
            console.error(err);
        }
    };

    const filteredItems = items.filter((item) => {

        const matchesSearch = item.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesUnit =
            unitFilter === "all" || item.unit === unitFilter;

        return matchesSearch && matchesUnit;
    });

    const exportExcel = () => {

        const ws = XLSX.utils.json_to_sheet(filteredItems);

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Items");

        XLSX.writeFile(wb, "Items_Report.xlsx");
    };

    const exportPDF = () => {

        const doc = new jsPDF();

        doc.text("Items Report", 14, 10);

        const rows = filteredItems.map((i) => [
            i.id,
            i.name,
            i.unit,
            i.created_at,
            i.updated_at
        ]);

        autoTable(doc, {
            head: [[
                "ID",
                "Name",
                "Unit",
                "Created",
                "Updated"
            ]],
            body: rows,
            startY: 20
        });

        doc.save("Items_Report.pdf");
    };

    return (

        <div className="min-h-screen bg-gray-50 p-6">

            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

                <div>

                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package size={22} />
                        Item Management
                    </h1>

                    <p className="text-gray-500 text-sm">
                        {new Date().toLocaleDateString()} |
                        {" "}
                        {new Date().toLocaleTimeString()}
                    </p>

                </div>

                <div className="flex gap-2 flex-wrap">

                    <button
                        onClick={loadItems}
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
                    value={unitFilter}
                    onChange={(e) => setUnitFilter(e.target.value)}
                    className="border px-3 py-2 rounded-lg"
                >

                    <option value="all">
                        All Units
                    </option>

                    {[...new Set(items.map(i => i.unit))].map(u => (

                        <option key={u} value={u}>
                            {u}
                        </option>

                    ))}

                </select>

            </div>

            {/* Form */}

            <div className="mb-8">
                <ItemForm />
            </div>

            {/* Table */}

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

                <div className="p-4 border-b flex justify-between">

                    <h2 className="font-semibold">
                        Item List
                    </h2>

                    <span>
                        Total: {filteredItems.length}
                    </span>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="p-3 text-left">
                                    ID
                                </th>

                                <th className="p-3 text-left">
                                    Name
                                </th>

                                <th className="p-3 text-left">
                                    Unit
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
                                        colSpan="6"
                                        className="text-center p-6"
                                    >
                                        Loading...
                                    </td>

                                </tr>

                            ) : filteredItems.length > 0 ? (

                                filteredItems.map((item) => (

                                    <tr
                                        key={item.id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-3">
                                            {item.id}
                                        </td>

                                        <td className="p-3 font-medium">
                                            {item.name}
                                        </td>

                                        <td className="p-3 text-blue-600 font-semibold">
                                            {item.unit}
                                        </td>

                                        <td className="p-3">
                                            {
                                                new Date(item.created_at)
                                                    .toLocaleString()
                                            }
                                        </td>

                                        <td className="p-3">
                                            {
                                                new Date(item.updated_at)
                                                    .toLocaleString()
                                            }
                                        </td>

                                        <td className="p-3 flex gap-2">

                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="bg-blue-500 text-white p-2 rounded"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item.id)}
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
                                        colSpan="6"
                                        className="text-center p-6"
                                    >
                                        No items found
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