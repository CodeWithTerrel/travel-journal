// frontend/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiGet, apiPut } from "../lib/api";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const label = "block text-sm font-medium text-slate-700 mb-1";
    const input =
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600";

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError("");
            try {
                const res = await apiGet("/api/users/me");
                if (!res.user) {
                    setError("You must be logged in to view your profile.");
                } else {
                    setUser(res.user);
                    setDisplayName(res.user.displayName || "");
                }
            } catch (err) {
                setError(err?.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function onSave(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!displayName.trim()) {
            setError("Display name is required.");
            return;
        }
        if (newPassword && newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }
        if (newPassword && newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const payload = {
            displayName: displayName.trim(),
        };
        if (newPassword) payload.password = newPassword;

        try {
            await apiPut("/api/users/me", payload);
            setMessage("Profile updated.");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError(err?.message || "Failed to update profile.");
        }
    }

    if (loading) return <div>Loading profile…</div>;
    if (!user)
        return (
            <section className="space-y-4">
                <PageTitle>Profile</PageTitle>
                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                        {error}
                    </div>
                )}
            </section>
        );

    return (
        <section className="space-y-6">
            <PageTitle>My Profile</PageTitle>

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
                onSubmit={onSave}
                className="rounded-xl border border-slate-200 p-6 bg-white max-w-xl mx-auto space-y-4"
            >
                <div>
                    <label className={label}>Email</label>
                    <input
                        className={`${input} bg-slate-100 cursor-not-allowed`}
                        value={user.email}
                        disabled
                    />
                </div>

                <div>
                    <label className={label}>Display name</label>
                    <input
                        className={input}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>

                <div>
                    <label className={label}>Role</label>
                    <input
                        className={`${input} bg-slate-100 cursor-not-allowed`}
                        value={user.role}
                        disabled
                    />
                </div>

                <hr className="my-4" />

                <div>
                    <label className={label}>New password (optional)</label>
                    <input
                        className={input}
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label className={label}>Confirm new password</label>
                    <input
                        className={input}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className="text-right">
                    <button className="rounded bg-teal-700 text-white px-5 py-2 hover:bg-teal-800">
                        Save changes
                    </button>
                </div>
            </form>
        </section>
    );
}
