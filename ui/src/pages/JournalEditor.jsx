// src/pages/JournalEditor.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { apiGet, apiPost, apiPatch } from "../lib/api";

export default function JournalEditor() {
    const { id } = useParams(); // if present => edit mode
    const navigate = useNavigate();

    const isEdit = Boolean(id);

    const [destinations, setDestinations] = useState([]);
    const [form, setForm] = useState({
        destinationId: "",
        title: "",
        notes: "",
        rating: "",
        visitDate: "",
        moodTag: "",
        activityTag: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load destinations and (if edit) existing journal
    useEffect(() => {
        async function load() {
            try {
                // Load destinations (for dropdown)
                const destResult = await apiGet("/api/destinations", {
                    status: "approved",
                    page: 1,
                    pageSize: 100,
                });
                setDestinations(destResult.items || []);

                if (isEdit) {
                    const j = await apiGet(`/api/journals/${id}`);
                    setForm({
                        destinationId: j.destinationId || "",
                        title: j.title || "",
                        notes: j.notes || "",
                        rating: j.rating != null ? String(j.rating) : "",
                        visitDate: j.visitDate || "",
                        moodTag: j.moodTag || "",
                        activityTag: j.activityTag || "",
                    });
                }
            } catch (err) {
                setMessage(err?.message || "Failed to load journal data");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [id, isEdit]);

    function setField(k, v) {
        setForm((f) => ({ ...f, [k]: v }));
    }

    // simple client validation
    function validate() {
        const e = {};
        if (!form.destinationId) e.destinationId = "Destination is required";
        if (!form.title.trim()) e.title = "Title is required";

        if (form.rating !== "") {
            const r = Number(form.rating);
            if (!(r >= 1 && r <= 5)) e.rating = "Rating must be between 1 and 5";
        }

        setErrors(e);
        return e;
    }

    async function onSubmit(e) {
        e.preventDefault();
        setMessage("");
        const eObj = validate();
        if (Object.keys(eObj).length) return;

        setSaving(true);
        try {
            const payload = {
                destinationId: form.destinationId,
                title: form.title.trim(),
                notes: form.notes,
                rating: form.rating === "" ? null : Number(form.rating),
                visitDate: form.visitDate || null,
                moodTag: form.moodTag || null,
                activityTag: form.activityTag || null,
            };

            if (isEdit) {
                await apiPatch(`/api/journals/${id}`, payload);
                setMessage("Journal updated successfully.");
            } else {
                await apiPost("/api/journals", payload);
                setMessage("Journal created successfully.");
            }

            // Navigate back to list after short delay
            setTimeout(() => navigate("/journals"), 600);
        } catch (err) {
            setMessage(err?.message || "Save failed");
            // If backend returned field errors
            if (err?.errors) setErrors(err.errors);
        } finally {
            setSaving(false);
        }
    }

    const label = "block text-sm font-medium text-slate-700 mb-1";
    const input =
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600";
    const help = "text-sm text-red-600 mt-1";

    const titleText = isEdit ? "Edit Journal Entry" : "New Journal Entry";

    if (loading) {
        return (
            <section className="space-y-4">
                <PageTitle>{titleText}</PageTitle>
                <div className="text-slate-600">Loading…</div>
            </section>
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <PageTitle>{titleText}</PageTitle>
                <Link
                    to="/journals"
                    className="text-sm text-teal-700 underline hover:text-teal-900"
                >
                    ← Back to Journal List
                </Link>
            </div>

            {message && (
                <div
                    className={`px-4 py-2 rounded ${
                        message.toLowerCase().includes("fail")
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                    }`}
                >
                    {message}
                </div>
            )}

            <form
                onSubmit={onSubmit}
                className="rounded-xl border border-slate-200 p-6 bg-white max-w-3xl mx-auto"
            >
                {/* Destination select */}
                <div className="mb-4">
                    <label className={label}>Destination *</label>
                    <select
                        className={input}
                        value={form.destinationId}
                        onChange={(e) => setField("destinationId", e.target.value)}
                    >
                        <option value="">-- Select a destination --</option>
                        {destinations.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name || `${d.city}, ${d.country}`}
                            </option>
                        ))}
                    </select>
                    {errors.destinationId && <div className={help}>{errors.destinationId}</div>}
                </div>

                {/* Title */}
                <div className="mb-4">
                    <label className={label}>Title *</label>
                    <input
                        className={input}
                        value={form.title}
                        onChange={(e) => setField("title", e.target.value)}
                        placeholder="e.g., Sunset walk along the river"
                    />
                    {errors.title && <div className={help}>{errors.title}</div>}
                </div>

                {/* Notes */}
                <div className="mb-4">
                    <label className={label}>Notes</label>
                    <textarea
                        rows={5}
                        className={input}
                        value={form.notes}
                        onChange={(e) => setField("notes", e.target.value)}
                        placeholder="Describe what you did, who you were with, favourite moments..."
                    />
                </div>

                {/* Visit date and rating */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={label}>Visit Date</label>
                        <input
                            type="date"
                            className={input}
                            value={form.visitDate || ""}
                            onChange={(e) => setField("visitDate", e.target.value)}
                        />
                        {errors.visitDate && <div className={help}>{errors.visitDate}</div>}
                    </div>
                    <div>
                        <label className={label}>Rating (optional)</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            className={input}
                            value={form.rating}
                            onChange={(e) => setField("rating", e.target.value)}
                            placeholder="1–5"
                        />
                        {errors.rating && <div className={help}>{errors.rating}</div>}
                    </div>
                </div>

                {/* Tags */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={label}>Mood Tag (optional)</label>
                        <input
                            className={input}
                            value={form.moodTag}
                            onChange={(e) => setField("moodTag", e.target.value)}
                            placeholder="e.g., Relaxed, Adventurous, Romantic"
                        />
                    </div>
                    <div>
                        <label className={label}>Activity Tag (optional)</label>
                        <input
                            className={input}
                            value={form.activityTag}
                            onChange={(e) => setField("activityTag", e.target.value)}
                            placeholder="e.g., Hiking, Museum, Food tour"
                        />
                    </div>
                </div>

                {/* Save button */}
                <div className="text-right">
                    <button
                        disabled={saving}
                        className="rounded bg-teal-700 text-white px-5 py-2 hover:bg-teal-800 disabled:opacity-50"
                    >
                        {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Journal"}
                    </button>
                </div>
            </form>
        </section>
    );
}
