// frontend/src/pages/Tags.jsx
import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiDelete, apiGet, apiPost } from "../lib/api";

export default function Tags() {
    const [moodTags, setMoodTags] = useState([]);
    const [activityTags, setActivityTags] = useState([]);
    const [newMood, setNewMood] = useState("");
    const [newActivity, setNewActivity] = useState("");
    const [error, setError] = useState("");

    async function loadTags() {
        setError("");
        try {
            const mood = await apiGet("/api/tags/mood");
            const activity = await apiGet("/api/tags/activity");
            setMoodTags(mood.items || []);
            setActivityTags(activity.items || []);
        } catch (err) {
            setError(err?.message || "Failed to load tags.");
        }
    }

    useEffect(() => {
        loadTags();
    }, []);

    async function addMoodTag(e) {
        e.preventDefault();
        const name = newMood.trim();
        if (!name) return;
        try {
            const created = await apiPost("/api/tags/mood", { name });
            setMoodTags((list) => [...list, created]);
            setNewMood("");
        } catch (err) {
            alert(err?.message || "Failed to add mood tag.");
        }
    }

    async function addActivityTag(e) {
        e.preventDefault();
        const name = newActivity.trim();
        if (!name) return;
        try {
            const created = await apiPost("/api/tags/activity", { name });
            setActivityTags((list) => [...list, created]);
            setNewActivity("");
        } catch (err) {
            alert(err?.message || "Failed to add activity tag.");
        }
    }

    async function deleteMood(id) {
        if (!confirm("Remove this mood tag?")) return;
        try {
            await apiDelete(`/api/tags/mood/${id}`);
            setMoodTags((list) => list.filter((t) => t.id !== id));
        } catch (err) {
            alert(err?.message || "Failed to delete mood tag.");
        }
    }

    async function deleteActivity(id) {
        if (!confirm("Remove this activity tag?")) return;
        try {
            await apiDelete(`/api/tags/activity/${id}`);
            setActivityTags((list) => list.filter((t) => t.id !== id));
        } catch (err) {
            alert(err?.message || "Failed to delete activity tag.");
        }
    }

    const input =
        "flex-1 rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600";

    return (
        <section className="space-y-6">
            <PageTitle>Tags (Admin)</PageTitle>

            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                    {error}
                </div>
            )}

            <p className="text-slate-700">
                Manage mood and activity tags that will be available when creating
                destinations and journals.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mood tags */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-3">
                        Mood tags
                    </h2>
                    <form onSubmit={addMoodTag} className="flex gap-2 mb-4">
                        <input
                            className={input}
                            placeholder="Add new mood…"
                            value={newMood}
                            onChange={(e) => setNewMood(e.target.value)}
                        />
                        <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">
                            Add
                        </button>
                    </form>
                    {moodTags.length === 0 ? (
                        <div className="text-sm text-slate-500">No mood tags yet.</div>
                    ) : (
                        <ul className="space-y-1 text-sm text-slate-800">
                            {moodTags
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((tag) => (
                                    <li
                                        key={tag.id}
                                        className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1"
                                    >
                                        <span>{tag.name}</span>
                                        <button
                                            type="button"
                                            className="text-xs font-semibold text-red-600 hover:text-red-700"
                                            onClick={() => deleteMood(tag.id)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>

                {/* Activity tags */}
                <div className="rounded-xl border border-slate-200 bg-white p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-3">
                        Activity tags
                    </h2>
                    <form onSubmit={addActivityTag} className="flex gap-2 mb-4">
                        <input
                            className={input}
                            placeholder="Add new activity…"
                            value={newActivity}
                            onChange={(e) => setNewActivity(e.target.value)}
                        />
                        <button className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800">
                            Add
                        </button>
                    </form>
                    {activityTags.length === 0 ? (
                        <div className="text-sm text-slate-500">
                            No activity tags yet.
                        </div>
                    ) : (
                        <ul className="space-y-1 text-sm text-slate-800">
                            {activityTags
                                .slice()
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((tag) => (
                                    <li
                                        key={tag.id}
                                        className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1"
                                    >
                                        <span>{tag.name}</span>
                                        <button
                                            type="button"
                                            className="text-xs font-semibold text-red-600 hover:text-red-700"
                                            onClick={() => deleteActivity(tag.id)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}
