// frontend/src/pages/JournalForm.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { apiGet, apiPost, apiPatch } from "../lib/api";

// mode is passed from router: "create" or "edit"
export default function JournalForm({ mode = "create" }) {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        destinationId: "",
        title: "",
        notes: "",
        rating: "",
        visitDate: "",
        moodTag: "",
        activityTag: "",
    });

    // text that appears in the destination textbox
    const [destInput, setDestInput] = useState("");

    const label = "block text-sm font-medium text-slate-700 mb-1";
    const input =
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600";
    const help = "text-sm text-red-600 mt-1";

    // initial destination from query (e.g. /journals/new?destinationId=3)
    const presetDestinationId = searchParams.get("destinationId");

    function setField(k, v) {
        setForm((f) => ({ ...f, [k]: v }));
    }

    const destinationOptions = useMemo(
        () =>
            destinations.map((d) => ({
                id: d.id,
                label: `${d.name} (${d.city}, ${d.country})`,
            })),
        [destinations]
    );

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError("");
            try {
                // load destinations for dropdown/autocomplete
                const result = await apiGet("/api/destinations", {
                    status: "approved",
                    page: 1,
                    pageSize: 100,
                });
                const items = result.items || [];
                setDestinations(items);

                if (mode === "edit" && id) {
                    const j = await apiGet(`/api/journals/${id}`);
                    // our journals API returns the full row; adjust as needed
                    const journal = j;
                    setForm({
                        destinationId: journal.destinationId,
                        title: journal.title || "",
                        notes: journal.notes || "",
                        rating: journal.rating || "",
                        visitDate: journal.visitDate || "",
                        moodTag: journal.moodTag || "",
                        activityTag: journal.activityTag || "",
                    });

                    const opt = items.find((d) => d.id === journal.destinationId);
                    if (opt) {
                        setDestInput(`${opt.name} (${opt.city}, ${opt.country})`);
                    }
                } else if (presetDestinationId) {
                    const destIdNum = Number(presetDestinationId);
                    setForm((f) => ({ ...f, destinationId: destIdNum }));
                    const opt = items.find((d) => d.id === destIdNum);
                    if (opt) {
                        setDestInput(`${opt.name} (${opt.city}, ${opt.country})`);
                    }
                }
            } catch (err) {
                console.error(err);
                setError(err?.message || "Failed to load journal form.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [mode, id, presetDestinationId]);

    const heading = useMemo(
        () => (mode === "edit" ? "Edit Journal Entry" : "New Journal Entry"),
        [mode]
    );

    function handleDestinationInputChange(e) {
        const value = e.target.value;
        setDestInput(value);

        // If the typed text exactly matches one of the labels,
        // set the destinationId to that option’s id.
        const match = destinationOptions.find((o) => o.label === value);
        setField("destinationId", match ? match.id : "");
    }

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!form.destinationId) {
            setError("Destination is required. Pick one from the suggestions.");
            return;
        }
        if (!form.title.trim()) {
            setError("Title is required.");
            return;
        }

        const payload = {
            destinationId: Number(form.destinationId),
            title: form.title.trim(),
            notes: form.notes,
            rating: form.rating ? Number(form.rating) : undefined,
            visitDate: form.visitDate || undefined,
            moodTag: form.moodTag || undefined,
            activityTag: form.activityTag || undefined,
        };

        try {
            setSaving(true);
            if (mode === "edit" && id) {
                await apiPatch(`/api/journals/${id}`, payload);
                setMessage("Journal updated.");
            } else {
                await apiPost("/api/journals", payload);
                setMessage("Journal created.");
                setTimeout(() => navigate("/journals"), 600);
            }
        } catch (err) {
            console.error(err);
            setError(err?.message || "Save failed.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div>Loading journal form…</div>;
    }

    return (
        <section className="space-y-6">
            <PageTitle>{heading}</PageTitle>

            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                    {error}
                </div>
            )}
            {message && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded">
                    {message}
                </div>
            )}

            <form
                onSubmit={onSubmit}
                className="rounded-xl border border-slate-200 p-6 bg-white max-w-3xl mx-auto"
            >
                {/* Destination text box with datalist suggestions */}
                <div className="mb-4">
                    <label className={label}>Destination *</label>
                    <input
                        className={input}
                        list="destinations-list"
                        value={destInput}
                        onChange={handleDestinationInputChange}
                        placeholder="Start typing a destination name..."
                    />
                    <datalist id="destinations-list">
                        {destinationOptions.map((o) => (
                            <option key={o.id} value={o.label} />
                        ))}
                    </datalist>
                    {!form.destinationId && (
                        <div className={help}>
                            Pick one of the suggestions so the journal links to a destination.
                        </div>
                    )}
                </div>

                {/* Title */}
                <div className="mb-4">
                    <label className={label}>Title *</label>
                    <input
                        className={input}
                        value={form.title}
                        onChange={(e) => setField("title", e.target.value)}
                        placeholder="e.g., Sunset at Wascana Lake"
                    />
                </div>

                {/* Visit date + rating */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={label}>Visit date</label>
                        <input
                            type="date"
                            className={input}
                            value={form.visitDate}
                            onChange={(e) => setField("visitDate", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={label}>Rating (1–5)</label>
                        <input
                            type="number"
                            min={1}
                            max={5}
                            className={input}
                            value={form.rating}
                            onChange={(e) => setField("rating", e.target.value)}
                        />
                    </div>
                </div>

                {/* Tags */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={label}>Mood tag</label>
                        <input
                            className={input}
                            value={form.moodTag}
                            onChange={(e) => setField("moodTag", e.target.value)}
                            placeholder="Relaxed, Adventurous, Romantic..."
                        />
                    </div>
                    <div>
                        <label className={label}>Activity tag</label>
                        <input
                            className={input}
                            value={form.activityTag}
                            onChange={(e) => setField("activityTag", e.target.value)}
                            placeholder="Hiking, Beach, City Walk..."
                        />
                    </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                    <label className={label}>Notes</label>
                    <textarea
                        rows={5}
                        className={input}
                        value={form.notes}
                        onChange={(e) => setField("notes", e.target.value)}
                        placeholder="Write about your experience…"
                    />
                </div>

                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        className="text-sm text-slate-600 hover:underline"
                        onClick={() => navigate("/journals")}
                    >
                        ← Back to journals
                    </button>
                    <button
                        className="rounded bg-teal-700 text-white px-5 py-2 hover:bg-teal-800 disabled:opacity-50"
                        disabled={saving}
                    >
                        {saving ? "Saving…" : "Save"}
                    </button>
                </div>
            </form>
        </section>
    );
}
