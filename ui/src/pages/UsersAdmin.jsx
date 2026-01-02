// frontend/src/pages/UsersAdmin.jsx
import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiDelete, apiGet } from "../lib/api";

export default function UsersAdmin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function loadUsers() {
        setLoading(true);
        setError("");
        try {
            const result = await apiGet("/api/users");
            setUsers(result.users || []);
        } catch (err) {
            setError(err?.message || "Failed to load users.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    async function handleDelete(id) {
        if (!confirm("Delete this user? This cannot be undone.")) return;
        try {
            await apiDelete(`/api/users/${id}`);
            setUsers((list) => list.filter((u) => u.id !== id));
        } catch (err) {
            alert(err?.message || "Delete failed.");
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

            {loading ? (
                <div className="text-slate-700">Loading users…</div>
            ) : users.length === 0 ? (
                <div className="text-slate-700">No users found.</div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="min-w-full text-left text-sm text-slate-800">
                        <thead className="bg-slate-100">
                        <tr>
                            <th className="px-4 py-2 font-semibold">ID</th>
                            <th className="px-4 py-2 font-semibold">Name</th>
                            <th className="px-4 py-2 font-semibold">Email</th>
                            <th className="px-4 py-2 font-semibold">Role</th>
                            <th className="px-4 py-2 font-semibold">Created</th>
                            <th className="px-4 py-2 font-semibold text-right">
                                Actions
                            </th>
                        </tr>
                        </thead>

                        <tbody>
                        {users.map((u) => {
                            const isAdmin = u.role === "admin";

                            return (
                                <tr
                                    key={u.id}
                                    className="border-t border-slate-200 hover:bg-slate-50"
                                >
                                    <td className="px-4 py-2">{u.id}</td>
                                    <td className="px-4 py-2">{u.displayName}</td>
                                    <td className="px-4 py-2">{u.email}</td>

                                    <td className="px-4 py-2">
                                            <span
                                                className={
                                                    isAdmin
                                                        ? "inline-flex items-center rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800"
                                                        : "inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
                                                }
                                            >
                                                {u.role}
                                            </span>
                                    </td>

                                    <td className="px-4 py-2">
                                        {u.createdAt
                                            ? new Date(u.createdAt).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    <td className="px-4 py-2 text-right">
                                        <button
                                            type="button"
                                            disabled={isAdmin}
                                            onClick={() => {
                                                if (!isAdmin) handleDelete(u.id);
                                            }}
                                            className={`text-xs font-semibold px-2 py-1 rounded
                                                    ${
                                                isAdmin
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "bg-red-600 text-white hover:bg-red-700"
                                            }
                                                `}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
