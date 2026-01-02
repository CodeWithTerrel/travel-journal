import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiGet, apiPut } from "../lib/api";

// user account page - edit own profile
export default function Account() {
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const label = "block text-sm font-medium text-slate-700 mb-1";
    const input =
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600";

    useEffect(() => {
        async function load() {
            setLoading(true);
            setError("");
            try {
                const result = await apiGet("/api/users/me");
                setDisplayName(result.user.displayName || "");
                setEmail(result.user.email || "");
            } catch (err) {
                setError(err?.message || "Please login to view your account.");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!displayName.trim()) {
            setError("Display name is required.");
            return;
        }
        if (password && password !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await apiPut("/api/users/me", {
                displayName,
                password: password || undefined,
            });
            setMessage("Account updated.");
            setPassword("");
            setConfirm("");
        } catch (err) {
            setError(err?.message || "Update failed.");
        }
    }

    if (loading) {
        return <div>Loading account…</div>;
    }

    return (
        <section className="space-y-6">
            <PageTitle>My Account</PageTitle>

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

            {!error && (
                <form
                    onSubmit={onSubmit}
                    className="rounded-xl border border-slate-200 p-6 bg-white max-w-lg mx-auto"
                >
                    <div className="mb-4">
                        <label className={label}>Display name</label>
                        <input
                            className={input}
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className={label}>Email (read-only)</label>
                        <input
                            className={input + " bg-slate-100 cursor-not-allowed"}
                            value={email}
                            disabled
                        />
                    </div>

                    <div className="mb-4">
                        <label className={label}>New password (optional)</label>
                        <input
                            className={input}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="mb-6">
                        <label className={label}>Confirm new password</label>
                        <input
                            className={input}
                            type="password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </div>

                    <div className="text-center">
                        <button className="rounded bg-teal-700 text-white px-5 py-2 hover:bg-teal-800">
                            Save changes
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}
