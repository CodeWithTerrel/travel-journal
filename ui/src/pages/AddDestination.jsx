// frontend/src/pages/AddDestination.jsx
import { useEffect, useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiGet, apiPostForm } from "../lib/api";

// Available countries for selection
const COUNTRIES = ["Canada", "Cameroon", "Nigeria", "America", "France"];

// Cities mapped to each country
const CITIES = {
    Canada: ["Saskatoon", "Toronto", "Vancouver", "Montreal", "Calgary"],
    Cameroon: ["Yaounde", "Douala", "Buea", "Limbe"],
    Nigeria: ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano"],
    America: ["New York", "Los Angeles", "Chicago", "Miami", "San Francisco"],
    France: ["Paris", "Lyon", "Marseille", "Nice", "Toulouse"],
};

export default function AddDestination() {
    // form state - hold all the input value
    const [form, setForm] = useState({
        name: "",
        country: "",
        city: "",
        visitDate: "",
        rating: "",
        description: "",
        cover: null,
        moodTag: "",
        activityTag: "",
    });
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    const [moodTags, setMoodTags] = useState([]);
    const [activityTags, setActivityTags] = useState([]);
    const [tagsError, setTagsError] = useState("");

    // get city option based on selected country
    const cityOptions = useMemo(
        () => (form.country ? CITIES[form.country] || [] : []),
        [form.country],
    );

    // reset city when country change
    useEffect(() => {
        setForm((f) => ({ ...f, city: "" }));
    }, [form.country]);

    // load tags from backend
    useEffect(() => {
        async function loadTags() {
            setTagsError("");
            try {
                const mood = await apiGet("/api/tags/mood");
                const activity = await apiGet("/api/tags/activity");
                setMoodTags(mood.items || []);
                setActivityTags(activity.items || []);
            } catch (err) {
                console.error("Failed to load tags:", err);
                // hide ugly backend "Not found" and just fail silently
                const msg = err?.message || "";
                if (!msg || msg === "Not found") {
                    setTagsError("");
                } else {
                    setTagsError("Some tag options could not be loaded.");
                }
            }
        }
        loadTags();
    }, []);

    // update a single field in the form
    function setField(k, v) {
        setForm((f) => ({ ...f, [k]: v }));
    }

    // validate all the form fields
    function validate() {
        const e = {};
        if (!form.name?.trim()) e.name = "Name is required";
        if (!form.country) e.country = "Country is required";
        if (!form.city) e.city = "City is required";
        if (!form.visitDate) e.visitDate = "Visit date is required";
        const r = Number(form.rating);
        if (!(r >= 1 && r <= 5)) e.rating = "Choose 1–5";
        if (!form.cover) e.cover = "Cover photo is required";
        else {
            const ok = ["image/jpeg", "image/png", "image/webp"].includes(
                form.cover.type,
            );
            if (!ok) e.cover = "Only JPG/PNG/WEBP";
            const max = 5 * 1024 * 1024;
            if (form.cover.size > max) e.cover = "Max 5MB";
        }
        return e;
    }

    // handle form submission
    async function onSubmit(e) {
        e.preventDefault();
        setMessage("");
        const eObj = validate();
        setErrors(eObj);
        if (Object.keys(eObj).length) return;

        // create FormData for file upload
        const fd = new FormData();
        fd.append("name", form.name.trim());
        fd.append("country", form.country);
        fd.append("city", form.city);
        fd.append("visitDate", form.visitDate);
        fd.append("rating", String(form.rating));
        fd.append("description", form.description || "");

        // Optional tags
        if (form.moodTag) fd.append("moodTag", form.moodTag);
        if (form.activityTag) fd.append("activityTag", form.activityTag);

        if (form.cover) fd.append("cover", form.cover);

        try {
            await apiPostForm("/api/destinations", fd);
            setMessage("Submitted! Your post is pending review.");

            // reset form after successful submit
            e.target.reset();
            setForm({
                name: "",
                country: "",
                city: "",
                visitDate: "",
                rating: "",
                description: "",
                cover: null,
                moodTag: "",
                activityTag: "",
            });
            setErrors({});
        } catch (err) {
            console.error("Add destination error:", err);

            const msg =
                err?.message && err.message !== "Not found"
                    ? err.message
                    : "Failed to submit. Please try again.";

            setMessage(msg);
        }
    }

    // styling classes for form elements
    const label = "block text-sm font-medium text-slate-700 mb-1";
    const input =
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600";
    const help = "text-sm text-red-600 mt-1";

    return (
        <section className="space-y-6">
            <PageTitle>Add Destination Form</PageTitle>

            {/* Success or error message for submit */}
            {message && (
                <div
                    className={`px-4 py-2 rounded ${
                        message.startsWith("Submitted")
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {message}
                </div>
            )}

            {/* Optional tag load warning (now never says "Not found") */}
            {tagsError && (
                <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded">
                    {tagsError}
                </div>
            )}

            {/* Main form */}
            <form
                onSubmit={onSubmit}
                className="rounded-xl border border-slate-200 p-6 bg-white max-w-3xl mx-auto"
            >
                {/* Name field */}
                <div className="mb-4">
                    <label className={label}>Name *</label>
                    <input
                        className={input}
                        value={form.name}
                        onChange={(e) => setField("name", e.target.value)}
                        placeholder="e.g., Canadian Museum for Human Rights"
                    />
                    {errors.name && <div className={help}>{errors.name}</div>}
                </div>

                {/* Country dropdown */}
                <div className="mb-4">
                    <label className={label}>Country *</label>
                    <select
                        className={input}
                        value={form.country}
                        onChange={(e) => setField("country", e.target.value)}
                    >
                        <option value="">-- Select a country --</option>
                        {COUNTRIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    {errors.country && <div className={help}>{errors.country}</div>}
                </div>

                {/* City dropdown - depend on country selection */}
                <div className="mb-4">
                    <label className={label}>City *</label>
                    <select
                        className={input}
                        value={form.city}
                        onChange={(e) => setField("city", e.target.value)}
                        disabled={!form.country}
                    >
                        <option value="">
                            {form.country ? "-- Select a city --" : "Select country first"}
                        </option>
                        {cityOptions.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    {errors.city && <div className={help}>{errors.city}</div>}
                </div>

                {/* Visit date picker */}
                <div className="mb-4">
                    <label className={label}>Visit Date *</label>
                    <input
                        type="date"
                        className={input}
                        value={form.visitDate}
                        onChange={(e) => setField("visitDate", e.target.value)}
                    />
                    {errors.visitDate && (
                        <div className={help}>{errors.visitDate}</div>
                    )}
                </div>

                {/* Rating radio buttons */}
                <div className="mb-4">
                    <label className={label}>Rating *</label>
                    <div className="flex items-center gap-6 text-slate-800">
                        {Array.from({ length: 5 }).map((_, i) => {
                            const v = i + 1;
                            return (
                                <label
                                    key={v}
                                    className="inline-flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="rating"
                                        value={v}
                                        checked={Number(form.rating) === v}
                                        onChange={() => setField("rating", v)}
                                    />
                                    <span className="text-base">{v}</span>
                                </label>
                            );
                        })}
                    </div>
                    {errors.rating && <div className={help}>{errors.rating}</div>}
                </div>

                {/* Description textarea */}
                <div className="mb-4">
                    <label className={label}>Notes / Comments</label>
                    <textarea
                        rows={5}
                        className={input}
                        value={form.description}
                        onChange={(e) => setField("description", e.target.value)}
                        placeholder="Tell us about this place..."
                    />
                </div>

                {/* Tags (from admin-managed lists) */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={label}>Mood tag (optional)</label>
                        <select
                            className={input}
                            value={form.moodTag}
                            onChange={(e) => setField("moodTag", e.target.value)}
                        >
                            <option value="">-- No mood tag --</option>
                            {moodTags
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((t) => (
                                    <option key={t.id} value={t.name}>
                                        {t.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label className={label}>Activity tag (optional)</label>
                        <select
                            className={input}
                            value={form.activityTag}
                            onChange={(e) =>
                                setField("activityTag", e.target.value)
                            }
                        >
                            <option value="">-- No activity tag --</option>
                            {activityTags
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((t) => (
                                    <option key={t.id} value={t.name}>
                                        {t.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                {/* Cover photo file input */}
                <div className="mb-6">
                    <label className={label}>Cover Photo *</label>
                    <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="block"
                        onChange={(e) =>
                            setField("cover", e.target.files?.[0] || null)
                        }
                    />
                    {errors.cover && <div className={help}>{errors.cover}</div>}
                </div>

                {/* Submit button */}
                <div className="text-right">
                    <button className="rounded bg-teal-700 text-white px-5 py-2 hover:bg-teal-800">
                        Post
                    </button>
                </div>
            </form>
        </section>
    );
}
