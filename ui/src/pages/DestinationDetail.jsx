// frontend/src/pages/DestinationDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Breadcrumb from "../components/Breadcrumb.jsx";
import { apiGet, apiDelete, apiPatch, buildImageUrl } from "../lib/api";
import StarRating from "../components/StarRating";

export default function DestinationDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [destination, setDestination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "",
        country: "",
        city: "",
        description: "",
        rating: "",
        visitDate: "",
    });
    const [saving, setSaving] = useState(false);

    function setField(k, v) {
        setEditForm((f) => ({ ...f, [k]: v }));
    }

    async function load() {
        setLoading(true);
        setError("");
        try {
            const detail = await apiGet(`/api/destinations/${id}`);
            const check = await apiGet("/api/auth/check");

            setDestination(detail.destination);
            setIsOwner(!!detail.isOwner);
            setIsAdmin(!!check.isAdmin);

            setEditForm({
                name: detail.destination.name || "",
                country: detail.destination.country || "",
                city: detail.destination.city || "",
                description: detail.destination.description || "",
                rating: detail.destination.rating || "",
                visitDate: detail.destination.visitDate || "",
            });
        } catch (err) {
            setError(err?.message || "Failed to load destination.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [id]);

    async function handleDelete() {
        if (!confirm("Delete this destination? This cannot be undone.")) return;
        setDeleting(true);
        setError("");
        try {
            await apiDelete(`/api/destinations/${id}`);
            navigate("/destinations");
        } catch (err) {
            setError(err?.message || "Delete failed.");
        } finally {
            setDeleting(false);
        }
    }

    async function handleSaveEdit(e) {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await apiPatch(`/api/destinations/${id}`, {
                name: editForm.name,
                country: editForm.country,
                city: editForm.city,
                description: editForm.description,
                rating: editForm.rating ? Number(editForm.rating) : undefined,
                visitDate: editForm.visitDate || undefined,
            });

            setIsEditing(false);
            await load();
        } catch (err) {
            setError(err?.message || "Update failed.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <section>
                <PageTitle>Loading...</PageTitle>
            </section>
        );
    }

    if (!destination) {
        return (
            <section>
                <PageTitle>Destination not found</PageTitle>
                {error && (
                    <p className="text-red-600 text-sm mt-2">
                        {error}
                    </p>
                )}
            </section>
        );
    }

    const imageUrl = buildImageUrl(destination.coverImagePath);

    const canEditOrDelete = isAdmin || isOwner;

    const label = "block text-sm font-medium text-slate-100 mb-1";
    const input =
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm";

    return (
        <section className="space-y-6">
            <Breadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Destinations", href: "/destinations" },
                    { label: destination.name || "Destination" },
                ]}
            />
            <PageTitle>{destination.name}</PageTitle>

            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">
                    {error}
                </div>
            )}

            {/* Main image banner */}
            <div className="relative rounded-xl overflow-hidden bg-slate-900 text-white">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={destination.name}
                        className="w-full h-72 object-cover opacity-70"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                <div className="relative p-6 space-y-4">
                    {/* Header row */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-semibold">
                                {destination.name}
                            </h2>
                            <p className="text-white/90 text-sm">
                                {destination.city}, {destination.country}
                            </p>
                            {destination.visitDate && (
                                <p className="text-white/80 text-xs mt-1">
                                    Visited:{" "}
                                    {new Date(
                                        destination.visitDate,
                                    ).toLocaleDateString()}
                                </p>
                            )}
                        </div>

                        {/* Rating and owner */}
                        <div className="flex flex-col items-start md:items-end gap-1">
                            <StarRating value={destination.rating} />
                            <p className="text-xs text-white/80">
                                Added by{" "}
                                <span className="font-semibold">
                                    {destination.ownerName || "Guest"}
                                </span>
                            </p>
                            {canEditOrDelete && (
                                <div className="flex gap-2 mt-1">
                                    {!isEditing && (
                                        <button
                                            type="button"
                                            className="px-3 py-1 rounded bg-white/15 text-xs font-semibold hover:bg-white/25"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        className="px-3 py-1 rounded bg-red-600 text-xs font-semibold hover:bg-red-700 disabled:opacity-60"
                                        disabled={deleting}
                                        onClick={handleDelete}
                                    >
                                        {deleting ? "Deleting…" : "Delete"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Description / edit form */}
                    {isEditing ? (
                        <form
                            onSubmit={handleSaveEdit}
                            className="mt-4 bg-black/30 rounded-lg p-4 space-y-3"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className={label}>Name</label>
                                    <input
                                        className={input}
                                        value={editForm.name}
                                        onChange={(e) =>
                                            setField("name", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className={label}>Country</label>
                                    <input
                                        className={input}
                                        value={editForm.country}
                                        onChange={(e) =>
                                            setField("country", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className={label}>City</label>
                                    <input
                                        className={input}
                                        value={editForm.city}
                                        onChange={(e) =>
                                            setField("city", e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className={label}>
                                        Visit date
                                    </label>
                                    <input
                                        type="date"
                                        className={input}
                                        value={editForm.visitDate}
                                        onChange={(e) =>
                                            setField(
                                                "visitDate",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div>
                                    <label className={label}>Rating (1–5)</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={5}
                                        className={input}
                                        value={editForm.rating}
                                        onChange={(e) =>
                                            setField("rating", e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={label}>Notes / comments</label>
                                <textarea
                                    rows={4}
                                    className={input}
                                    value={editForm.description}
                                    onChange={(e) =>
                                        setField("description", e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 rounded bg-white/10 text-sm hover:bg-white/20"
                                    onClick={() => setIsEditing(false)}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded bg-teal-500 text-sm font-semibold hover:bg-teal-600 disabled:opacity-60"
                                    disabled={saving}
                                >
                                    {saving ? "Saving…" : "Save changes"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-white/95 leading-relaxed mt-3">
                            {destination.description || "—"}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
