// frontend/src/pages/Moderation.jsx
import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiGet, apiPatch, buildImageUrl } from "../lib/api";

export default function Moderation() {
    const [items, setItems] = useState([]);
    const [busyId, setBusyId] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Load pending destinations from the API
    async function load() {
        setLoading(true);
        setError("");
        try {
            // Requires admin cookie; backend returns 403 if not admin
            const rows = await apiGet("/api/destinations/admin/pending/list");
            setItems(rows || []);
        } catch (err) {
            setItems([]);
            setError(err?.message || "Admin only");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    // Approve or reject
    async function act(id, action) {
        setError("");
        setBusyId(id);
        try {
            const path = action === "approve" ? "approve" : "reject";
            await apiPatch(`/api/destinations/${id}/${path}`, {});
            await load(); // reload after action
        } catch (err) {
            setError(err?.message || "Action failed");
        } finally {
            setBusyId(null);
        }
    }

    return (
        <section className="space-y-6">
            <PageTitle>Moderation</PageTitle>

            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-slate-600">Loading pending posts…</div>
            ) : items.length === 0 ? (
                <div className="text-slate-600">
                    {error ? "No access." : "Nothing to review right now."}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {items.map((it) => {
                        // Build proper image URL for each item
                        const imageUrl = buildImageUrl(it.coverImagePath);

                        return (
                            <div
                                key={it.id}
                                className="rounded-xl ring-1 ring-gray-200 overflow-hidden bg-white"
                            >
                                {/* Image preview */}
                                <div className="aspect-[4/3] bg-slate-100 relative">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={it.name || ""}
                                            className="absolute inset-0 w-full h-full object-cover"
                                            onError={(e) => {
                                                // Hide the image if it fails
                                                e.target.style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                            No image
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4 space-y-1">
                                    <div className="font-semibold line-clamp-1">
                                        {it.name || `${it.city}, ${it.country}`}
                                    </div>
                                    <div className="text-slate-600 text-sm">
                                        {it.city}, {it.country}
                                        {it.visitDate
                                            ? ` • ${new Date(
                                                it.visitDate
                                            ).toLocaleDateString()}`
                                            : ""}
                                    </div>

                                    {/* Rating */}
                                    <div
                                        className="text-amber-400 text-sm"
                                        aria-label={`Rating ${it.rating || 0}`}
                                    >
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i}>
                                                {i < (it.rating || 0) ? "★" : "☆"}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Description */}
                                    {it.description && (
                                        <p className="text-sm text-slate-700 mt-2 line-clamp-3">
                                            {it.description}
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="p-4 flex gap-3">
                                    <button
                                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                                        disabled={busyId === it.id}
                                        onClick={() => act(it.id, "approve")}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                                        disabled={busyId === it.id}
                                        onClick={() => act(it.id, "reject")}
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
