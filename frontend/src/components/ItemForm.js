import { useState } from "react";
import { API } from "../api/api";

export default function ItemForm() {
    const [data, setData] = useState({ name: "", unit: "" });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!data.name || !data.unit) {
            alert("Please fill all fields");
            return;
        }

        try {
            setLoading(true);
            await API.post("/items", data);
            alert("Item Added Successfully");
            setData({ name: "", unit: "" });
        } catch (err) {
            console.error(err);
            alert("Error adding item");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-sm border">

            {/* Header */}
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Add New Item
            </h2>

            {/* Form */}
            <div className="space-y-5">

                {/* Item Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Item Name
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        placeholder="Enter item name"
                        onChange={(e) =>
                            setData({ ...data, name: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Unit Select */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Unit
                    </label>
                    <select
                        value={data.unit}
                        onChange={(e) =>
                            setData({ ...data, unit: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select unit</option>
                        <option value="pcs">Pieces (pcs)</option>
                        <option value="box">Box</option>
                        <option value="pack">Pack</option>
                    </select>
                </div>

                {/* Button */}
                <div className="pt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Add Item"}
                    </button>
                </div>
            </div>
        </div>
    );
}