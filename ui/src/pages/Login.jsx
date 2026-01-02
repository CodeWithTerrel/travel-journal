import { useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiPost } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

// Login page – admin or regular users
export default function Login() {
    const [email, setEmail] = useState("test@t.ca");
    const [password, setPassword] = useState("123456Pw");
    const [remember, setRemember] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Submit normal email/password login
    async function onSubmit(e) {
        e.preventDefault();
        setError("");

        try {
            // backend currently expects "rememberMe" in your version
            await apiPost("/api/auth/login", {
                email,
                password,
                rememberMe: remember,
            });

            // go to moderation/profile etc. after login
            navigate("/moderation");
            // reload so navbar (admin links, logout) update
            window.location.reload();
        } catch (err) {
            setError(err?.message || "Login failed");
        }
    }

    // Handle Google OAuth (React Google Login -> our API -> JWT)
    async function handleGoogleSuccess(credentialResponse) {
        try {
            setError("");

            const credential = credentialResponse?.credential;
            if (!credential) {
                throw new Error("Missing Google credential");
            }

            // Call backend endpoint that verifies Google token and returns our JWT + user
            const result = await apiPost("/api/auth/google-jwt", {
                credential,
            });

            // If your backend returns { token, user }, you could store the token here
            // localStorage.setItem("traveljournal_jwt", result.token);

            console.log("Google login success:", result);

            // After successful Google login, navigate and reload like normal login
            navigate("/moderation");
            window.location.reload();
        } catch (err) {
            console.error("Google login failed:", err);
            setError(err?.message || "Google login failed");
        }
    }

    function handleGoogleError() {
        setError("Google login failed");
    }

    // Go to register page (but not on navbar)
    function handleRegisterClick() {
        navigate("/register");
    }

    const label = "block text-sm font-medium text-slate-700 mb-1";
    const input =
        "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600";

    return (
        <section className="space-y-6">
            <PageTitle>Login to Travel Journal</PageTitle>

            {/* Error banner */}
            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                    {error}
                </div>
            )}

            <form
                onSubmit={onSubmit}
                className="rounded-xl border border-slate-200 p-6 bg-white max-w-lg mx-auto space-y-4"
            >
                {/* Email */}
                <div>
                    <label className={label}>Email</label>
                    <input
                        className={input}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Password */}
                <div>
                    <label className={label}>Password</label>
                    <input
                        type="password"
                        className={input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                    <input
                        id="remember"
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                    <label htmlFor="remember" className="text-sm text-slate-700">
                        Remember me on this device
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-3 mt-4">
                    {/* Normal login */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-teal-700 text-white px-5 py-3
                                   font-semibold hover:bg-teal-800 transition"
                    >
                        Login
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-xs text-slate-500">OR</span>
                        <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    {/* Google sign in (React Google Login) */}
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                        />
                    </div>

                    {/* Register button (just navigates to /register) */}
                    <button
                        type="button"
                        onClick={handleRegisterClick}
                        className="w-full py-3 rounded-lg border border-teal-700
                                   text-teal-700 font-semibold hover:bg-teal-50 transition"
                    >
                        Create an Account
                    </button>
                </div>

                {/* Admin hint */}
                <p className="text-xs text-slate-500 mt-3 text-center">
                    Admin credentials:&nbsp;
                    <strong>test@t.ca</strong> / <strong>123456Pw</strong>
                </p>
            </form>
        </section>
    );
}
