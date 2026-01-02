// frontend/src/pages/Users.jsx
import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiDelete, apiGet } from "../lib/api";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError("");
            try {
                const res = await apiGet("/api/users");
                setUsers(res.users || []);
            } catch (err) {
                setError(err?.message || "Failed to load users.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function handleDelete(id) {
        if (!confirm("Delete this user? This cannot be undone.")) return;
        try {
            await apiDelete(`/api/users/${id}`);
            setUsers((list) => list.filter((u) => u.id !== id));
        } catch (err) {
            alert(err?.message || "Failed to delete user.");
        }
    }

    return (
        <section className="space-y-6">
            <PageTitle>Users (Admin)</PageTitle>

            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                    {error}
                </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-white p-6">
                {loading ? (
                    <div>Loading users…</div>
                ) : users.length === 0 ? (
                    <div className="text-sm text-slate-500">
                        No users in the system yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-slate-800">
                            <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="text-left px-3 py-2">ID</th>
                                <th className="text-left px-3 py-2">
                                    Display name
                                </th>
                                <th className="text-left px-3 py-2">Email</th>
                                <th className="text-left px-3 py-2">Role</th>
                                <th className="text-left px-3 py-2">
                                    Created
                                </th>
                                <th className="text-left px-3 py-2">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((u) => (
                                <tr
                                    key={u.id}
                                    className="border-b border-slate-100 hover:bg-slate-50"
                                >
                                    <td className="px-3 py-2">{u.id}</td>
                                    <td className="px-3 py-2">
                                        {u.displayName}
                                    </td>
                                    <td className="px-3 py-2">{u.email}</td>
                                    <td className="px-3 py-2 uppercase text-xs tracking-wide">
                                        {u.role}
                                    </td>
                                    <td className="px-3 py-2 text-xs text-slate-500">
                                        {u.createdAt || ""}
                                    </td>
                                    <td className="px-3 py-2">
                                        <button
                                            className="text-xs font-semibold text-red-600 hover:text-red-700"
                                            onClick={() => handleDelete(u.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}
