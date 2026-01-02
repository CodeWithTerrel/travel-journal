import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiGet, apiDelete } from "../lib/api";
import { Link, useNavigate } from "react-router-dom";

export default function Journals() {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            try {
                const data = await apiGet("/api/journals");
                setJournals(data);
            } catch (err) {
                setError(err?.message || "Failed to load journals.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function handleDelete(id) {
        if (!window.confirm("Delete this journal entry?")) return;

        try {
            await apiDelete(`/api/journals/${id}`);
            setJournals((prev) => prev.filter((j) => j.id !== id));
        } catch (err) {
            alert(err?.message || "Delete failed.");
        }
    }

    if (loading) {
        return <div>Loading journals…</div>;
    }

    return (
        <section className="space-y-6">
            <PageTitle>Your Journals</PageTitle>

            {/* New Journal Entry Button */}
            <div className="text-right">
                <Link
                    to="/journals/new"
                    className="inline-block rounded bg-teal-700 text-white px-5 py-2 hover:bg-teal-800"
                >
                    + New Journal Entry
                </Link>
            </div>

            {/* Errors */}
            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                    {error}
                </div>
            )}

            {/* Journal list */}
            {journals.length === 0 ? (
                <p>No journal entries yet.</p>
            ) : (
                <div className="space-y-4">
                    {journals.map((j) => (
                        <div
                            key={j.id}
                            className="rounded-xl border border-slate-200 p-4 bg-white flex justify-between items-start"
                        >
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {j.title}
                                </h3>
                                <p className="text-sm text-slate-600">
                                    Destination: {j.destinationName} ({j.destinationCity},{" "}
                                    {j.destinationCountry})
                                </p>

                                {j.visitDate && (
                                    <p className="text-sm text-slate-600 mt-1">
                                        Visit Date: {j.visitDate}
                                    </p>
                                )}

                                {j.rating && (
                                    <p className="text-sm text-slate-600 mt-1">
                                        Rating: {j.rating}/5
                                    </p>
                                )}

                                {j.notes && (
                                    <p className="text-sm text-slate-600 mt-2">
                                        {j.notes}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 ml-6">
                                <Link
                                    to={`/journals/${j.id}/edit`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(j.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
