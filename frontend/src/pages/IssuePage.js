import { useEffect, useState } from "react";
import IssueForm from "../components/IssueForm";
import { API } from "../api/api";

export default function IssuePage() {
    const [issues, setIssues] = useState([]);

    const loadIssues = async () => {
        const res = await API.get("/issues");
        setIssues(res.data);
    };

    useEffect(() => {
        loadIssues();
    }, []);

    return (
        <div>
            <h1 className="text-xl font-bold">Issue Items (Branch Wise)</h1>

            <IssueForm />

            <table className="w-full mt-4 border">
                <thead>
                    <tr className="bg-gray-200">
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Branch</th>
                        <th>Month</th>
                        <th>Year</th>
                    </tr>
                </thead>

                <tbody>
                    {issues.map((i) => (
                        <tr key={i.id} className="text-center border">
                            <td>{i.item_name}</td>
                            <td>{i.quantity}</td>
                            <td>{i.branch}</td>
                            <td>{i.month}</td>
                            <td>{i.year}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}