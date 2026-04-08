import { useState } from "react";
import { API } from "../api/api";

export default function ItemForm() {
        const [data, setData] = useState({ name: "", unit: "" });

        const handleSubmit = async () => {
            await API.post("/items", data);
            alert("Item Added");
        };

        return (
            <div>
                <input placeholder="Item Name"
                    onChange={e => setData({ ...data, name: e.target.value })} />

                <input placeholder="Unit (pcs, box)"
                    onChange={e => setData({ ...data, unit: e.target.value })} />

                <button onClick={handleSubmit}>Add Item</button>
            </div>
        );
    }
