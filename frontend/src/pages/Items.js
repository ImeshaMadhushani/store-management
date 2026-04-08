import { useEffect, useState } from "react";
import ItemForm from "../components/ItemForm";
import { API } from "../api/api";

export default function Items() {
    const [items, setItems] = useState([]);

    const loadItems = async () => {
        const res = await API.get("/items");
        setItems(res.data);
    };

    useEffect(() => {
        loadItems();
    }, []);

    return (
        <div>
            <h1 className="text-xl font-bold">Items</h1>

            <ItemForm />

            <table className="w-full mt-4 border">
                <thead>
                    <tr className="bg-gray-200">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Unit</th>
                        
                    </tr>
                </thead>

                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} className="text-center border">
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.unit}</td>
                          
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}