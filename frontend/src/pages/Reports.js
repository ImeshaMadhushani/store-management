import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Wallet, Download } from "lucide-react";
import { API } from "../api/api";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
            const [r1, r2, r3, r4, r5] = await Promise.all([
                API.get("/stock/report"),
                API.get("/stock/monthly"),
                API.get("/issues/monthly"),
                API.get("/stock/yearly"),
                API.get("/issues/yearly")
            ]);

            setReport(r1.data);
            setMonthly(r2.data);
            setIssues(r3.data);
            setYearlyStock(r4.data);
            setYearlyIssues(r5.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const exportExcel = (data, fileName) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    };

    // ✅ Export ALL reports to single Excel (multiple sheets)
    const exportAllExcel = () => {
        const wb = XLSX.utils.book_new();

        const addSheet = (data, name) => {
            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, name);
        };

        addSheet(report, "Summary");
        addSheet(monthly, "Monthly Stock");
        addSheet(issues, "Monthly Issues");
        addSheet(yearlyStock, "Yearly Stock");
        addSheet(yearlyIssues, "Yearly Issues");

        XLSX.writeFile(wb, "All_Reports.xlsx");
    };

    const exportPDF = (data, title) => {
        const doc = new jsPDF();
        doc.text(title, 14, 10);

        if (data.length === 0) return;

        const columns = Object.keys(data[0]);
        const rows = data.map(obj => columns.map(col => obj[col]));

        autoTable(doc, {
            head: [columns],
            body: rows,
            startY: 20
        });

        doc.save(`${title}.pdf`);
    };

    // ✅ Export ALL reports to single PDF
    const exportAllPDF = () => {
        const doc = new jsPDF();

        const addSection = (title, data, startY) => {
            doc.text(title, 14, startY);

            if (data.length === 0) return startY + 10;

            const columns = Object.keys(data[0]);
            const rows = data.map(obj => columns.map(col => obj[col]));

            autoTable(doc, {
                head: [columns],
                body: rows,
                startY: startY + 5
            });

            return doc.lastAutoTable.finalY + 10;
        };

        let y = 10;
        y = addSection("Summary Report", report, y);
        y = addSection("Monthly Stock", monthly, y);
        y = addSection("Monthly Issues", issues, y);
        y = addSection("Yearly Stock", yearlyStock, y);
        y = addSection("Yearly Issues", yearlyIssues, y);

        doc.save("All_Reports.pdf");
    };

    const totalIn = report.reduce((sum, item) => sum + Number(item.total_in), 0);
    const totalOut = report.reduce((sum, item) => sum + Number(item.total_out), 0);
    const balance = totalIn - totalOut;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-lg animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            {/* Header + Export Buttons */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
                    <p className="text-gray-500">Stock Management & Reports Overview</p>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={() => exportExcel(monthly, "Monthly_Stock")}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                        <Download size={16} /> Excel
                    </button>

                    <button
                        onClick={() => exportPDF(monthly, "Monthly Stock Report")}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        <Download size={16} /> PDF
                    </button>

                    <button
                        onClick={exportAllExcel}
                        className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800"
                    >
                        <Download size={16} /> All Excel
                    </button>

                    <button
                        onClick={exportAllPDF}
                        className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black"
                    >
                        <Download size={16} /> All PDF
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card title="Total Stock In" value={totalIn} icon={<TrendingUp />} color="green" />
                <Card title="Total Stock Out" value={totalOut} icon={<TrendingDown />} color="red" />
                <Card title="Balance" value={balance} icon={<Wallet />} color="blue" />
            </div>

            {/* Tables */}
            <Table title="Monthly Stock Added" data={monthly} columns={["month", "year", "name", "total_added"]} />
            <Table title="Monthly Issued Stock" data={issues} columns={["month", "year", "name", "total_issued"]} />
            <Table title="Yearly Stock Added" data={yearlyStock} columns={["year", "name", "total_added"]} />
            <Table title="Yearly Issued Stock" data={yearlyIssues} columns={["year", "name", "total_issued"]} />
        </div>
    );
}

function Card({ title, value, icon, color }) {
    const colors = {
        green: "bg-green-100 text-green-700",
        red: "bg-red-100 text-red-700",
        blue: "bg-blue-100 text-blue-700"
    };

    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm text-gray-500">{title}</h2>
                <div className={`p-2 rounded-lg ${colors[color]}`}>
                    {icon}
                </div>
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    );
}

function Table({ title, data, columns }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border mb-8">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-semibold text-gray-700">{title}</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase">
                        <tr>
                            {columns.map((col, i) => (
                                <th key={i} className="p-3 text-left">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((row, i) => (
                                <tr key={i} className="border-t hover:bg-gray-50">
                                    {columns.map((col, j) => (
                                        <td key={j} className="p-3">{row[col]}</td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="text-center p-4 text-gray-400">
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
