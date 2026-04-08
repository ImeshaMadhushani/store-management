import { useEffect, useState } from "react";
import { API } from "../api/api";

export default function IssueForm() {
    const [items, setItems] = useState([]);
    const [data, setData] = useState({});

    useEffect(() => {
        API.get("/items").then(res => setItems(res.data));
    }, []);

    const submit = async () => {
        await API.post("/issues", data);
        alert("Issued");
    };

    return (
        <div>
            <select onChange={e => setData({ ...data, item_id: e.target.value })}>
                <option>Select Item</option>
                {items.map(i => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                ))}
            </select>

            <input placeholder="Quantity"
                onChange={e => setData({ ...data, quantity: e.target.value })} />

            <input placeholder="Branch"
                onChange={e => setData({ ...data, branch: e.target.value })} />

            <input placeholder="Month"
                onChange={e => setData({ ...data, month: e.target.value })} />

            <input placeholder="Year"
                onChange={e => setData({ ...data, year: e.target.value })} />

            <button onClick={submit}>Issue</button>
        </div>
    );
}