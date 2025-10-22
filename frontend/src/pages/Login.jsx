import { useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiPost } from "../lib/api";
import { setAdmin } from "../lib/auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    async function onSubmit(e) {
        e.preventDefault();
        setMsg("");
        try {
            await apiPost("/api/auth/login", { email, password });
            setAdmin(true);
            setMsg("Logged in as admin.");
        } catch (err) {
            setAdmin(false);
            setMsg(err.message || "Login failed");
        }
    }

    return (
        <section className="space-y-6">
            <PageTitle>Login to Travel Journal</PageTitle>

            <form onSubmit={onSubmit} className="bg-white rounded-xl ring-1 ring-gray-200 p-8 max-w-lg">
                {msg && <div className="mb-4 text-slate-700 bg-slate-100 rounded px-3 py-2">{msg}</div>}
                <div className="space-y-4">
                    <div>
                        <div className="text-sm font-medium mb-1">Email</div>
                        <input className="w-full border rounded-md h-12 px-3"
                               value={email} onChange={(e)=>setEmail(e.target.value)} />
                    </div>
                    <div>
                        <div className="text-sm font-medium mb-1">Password</div>
                        <input type="password" className="w-full border rounded-md h-12 px-3"
                               value={password} onChange={(e)=>setPassword(e.target.value)} />
                    </div>
                    <button className="bg-[#0F766E] text-white px-6 py-2 rounded-lg mx-auto block">Login</button>
                    <p className="text-center text-sm text-slate-600">Use test@t.ca / 123456Pw</p>
                </div>
            </form>
        </section>
    );
}
