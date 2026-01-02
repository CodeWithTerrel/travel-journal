// frontend/src/pages/Register.jsx
import { useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiPost } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const label = "block text-sm font-medium text-slate-700 mb-1";
    const input =
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600";

    async function onSubmit(e) {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!displayName.trim()) {
            setError("Display name is required.");
            return;
        }
        if (!email.trim()) {
            setError("Email is required.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await apiPost("/api/users/register", {
                displayName: displayName.trim(),
                email: email.trim(),
                password,
            });

            setMessage("Account created! Redirecting to profile...");
            // backend already set cookie and logged user in
            setTimeout(() => {
                navigate("/profile");
                window.location.reload();
            }, 700);
        } catch (err) {
            setError(err?.message || "Registration failed.");
        }
    }

    return (
        <section className="space-y-6">
            <PageTitle>Create an Account</PageTitle>

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
                className="rounded-xl border border-slate-200 p-6 bg-white max-w-lg mx-auto space-y-4"
            >
                <div>
                    <label className={label}>Display name</label>
                    <input
                        className={input}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>

                <div>
                    <label className={label}>Email</label>
                    <input
                        className={input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <label className={label}>Password</label>
                    <input
                        className={input}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label className={label}>Confirm password</label>
                    <input
                        className={input}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div className="text-center">
                    <button className="rounded bg-teal-700 text-white px-5 py-2 hover:bg-teal-800">
                        Register
                    </button>
                </div>
            </form>
        </section>
    );
}
