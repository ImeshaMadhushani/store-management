import { useEffect, useState } from "react";
import { API } from "../api/api";

export default function StockForm() {
    const [items, setItems] = useState([]);
    const [data, setData] = useState({
        item_id: "",
        quantity: "",
        month: "",
        year: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        API.get("/items").then(res => setItems(res.data));
    }, []);

    const submit = async () => {
        if (!data.item_id || !data.quantity || !data.month || !data.year) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);
            await API.post("/stock", data);
            alert("Stock Added Successfully");
            setData({ item_id: "", quantity: Number(data.quantity), month: "", year: "" });
        } catch (err) {
            console.error(err);
            alert("Error adding stock");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-sm border">

            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Add Stock Entry
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Item Select */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Select Item
                    </label>
                    <select
                        value={data.item_id}
                        onChange={(e) =>
                            setData({ ...data, item_id: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Choose item</option>
                        {items.map(i => (
                            <option key={i.id} value={i.id}>
                                {i.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quantity */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Quantity
                    </label>
                    <input
                        type="number"
                        placeholder="Enter quantity"
                        value={data.quantity}
                        onChange={(e) =>
                            setData({ ...data, quantity: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Month */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Month
                    </label>
                    <select
                        value={data.month}
                        onChange={(e) =>
                            setData({ ...data, month: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select month</option>
                        {[
                            "January", "February", "March", "April", "May", "June",
                            "July", "August", "September", "October", "November", "December"
                        ].map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                {/* Year */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Year
                    </label>
                    <input
                        type="number"
                        placeholder="e.g. 2026"
                        value={data.year}
                        onChange={(e) =>
                            setData({ ...data, year: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

            </div>

            {/* Button */}
            <div className="mt-6">
                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Add Stock"}
                </button>
            </div>
        </div>
    );
}