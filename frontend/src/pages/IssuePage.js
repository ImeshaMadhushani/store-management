import { useEffect, useState } from "react";
import IssueForm from "../components/IssueForm";
import { API } from "../api/api";

import {
    FileMinus,
    RefreshCw,
    Pencil,
    Trash2
} from "lucide-react";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function IssuePage() {

    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [branchFilter, setBranchFilter] = useState("all");

    const loadIssues = async () => {

        try {

            setLoading(true);

            const res = await API.get("/issues");

            setIssues(res.data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadIssues();
    }, []);

    const handleDelete = async (id) => {

        if (window.confirm("Delete this issue?")) {

            try {

                await API.delete(`/issues/${id}`);

                loadIssues();

            } catch (err) {

                console.error(err);
            }
        }
    };

    const handleEdit = async (i) => {

        const quantity = prompt(
            "Enter New Quantity",
            i.quantity
        );

        if (!quantity) return;

        try {

            await API.put(`/issues/${i.id}`, {
                item_id: i.item_id,
                quantity,
                branch: i.branch,
                month: i.month,
                year: i.year
            });

            loadIssues();

        } catch (err) {

            console.error(err);
        }
    };

    const filteredIssues = issues.filter((i) => {

        const matchesSearch = i.item_name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesBranch =
            branchFilter === "all" ||
            i.branch === branchFilter;

        return matchesSearch && matchesBranch;
    });

    const exportExcel = () => {

        const ws = XLSX.utils.json_to_sheet(filteredIssues);

        const wb = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "Issues");

        XLSX.writeFile(wb, "Issue_Report.xlsx");
    };

    const exportPDF = () => {

        const doc = new jsPDF();

        doc.text("Issue Report", 14, 10);

        const tableData = filteredIssues.map((i) => [
            i.item_name,
            i.quantity,
            i.branch,
            i.month,
            i.year,
            i.created_at,
            i.updated_at
        ]);

        autoTable(doc, {
            head: [[
                "Item",
                "Qty",
                "Branch",
                "Month",
                "Year",
                "Created",
                "Updated"
            ]],
            body: tableData,
            startY: 20
        });

        doc.save("Issue_Report.pdf");
    };

    return (

        <div className="min-h-screen bg-gray-50 p-6">

            {/* Header */}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">

                <div>

                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <FileMinus size={22} />
                        Issue Management
                    </h1>

                    <p className="text-gray-500 text-sm">
                        {new Date().toLocaleDateString()}
                        {" | "}
                        {new Date().toLocaleTimeString()}
                    </p>

                </div>

                <div className="flex gap-2 flex-wrap">

                    <button
                        onClick={loadIssues}
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
                    value={branchFilter}
                    onChange={(e) => setBranchFilter(e.target.value)}
                    className="border px-3 py-2 rounded-lg"
                >

                    <option value="all">
                        All Branches
                    </option>

                    {[...new Set(issues.map(i => i.branch))].map((b) => (

                        <option key={b} value={b}>
                            {b}
                        </option>

                    ))}

                </select>

            </div>

            {/* Form */}

            <div className="mb-8">
                <IssueForm />
            </div>

            {/* Table */}

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

                <div className="p-4 border-b flex justify-between">

                    <h2 className="font-semibold">
                        Issued Items
                    </h2>

                    <span>
                        Total: {filteredIssues.length}
                    </span>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="p-3 text-left">
                                    Item
                                </th>

                                <th className="p-3 text-left">
                                    Quantity
                                </th>

                                <th className="p-3 text-left">
                                    Branch
                                </th>

                                <th className="p-3 text-left">
                                    Month
                                </th>

                                <th className="p-3 text-left">
                                    Year
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
                                        colSpan="8"
                                        className="text-center p-6"
                                    >
                                        Loading...
                                    </td>

                                </tr>

                            ) : filteredIssues.length > 0 ? (

                                filteredIssues.map((i) => (

                                    <tr
                                        key={i.id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-3 font-medium">
                                            {i.item_name}
                                        </td>

                                        <td className="p-3 text-red-600 font-semibold">
                                            {i.quantity}
                                        </td>

                                        <td className="p-3">
                                            {i.branch}
                                        </td>

                                        <td className="p-3">
                                            {i.month}
                                        </td>

                                        <td className="p-3">
                                            {i.year}
                                        </td>

                                        <td className="p-3">
                                            {
                                                new Date(i.created_at)
                                                    .toLocaleString()
                                            }
                                        </td>

                                        <td className="p-3">
                                            {
                                                new Date(i.updated_at)
                                                    .toLocaleString()
                                            }
                                        </td>

                                        <td className="p-3 flex gap-2">

                                            <button
                                                onClick={() => handleEdit(i)}
                                                className="bg-blue-500 text-white p-2 rounded"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(i.id)}
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
                                        colSpan="8"
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