import { useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiPostForm } from "../lib/api";
import { adminHeader, isAdmin } from "../lib/auth";

export default function AddDestination() {
    const [form, setForm] = useState({ name:"", country:"", city:"", description:"" });
    const [cover, setCover] = useState(null);
    const [errors, setErrors] = useState({});
    const [msg, setMsg] = useState("");

    if (!isAdmin()) {
        return (
            <section className="space-y-6">
                <PageTitle>Add Destination</PageTitle>
                <div className="text-red-600">Admin only. Please log in.</div>
            </section>
        );
    }

    function onChange(e){ setForm(f => ({...f, [e.target.name]: e.target.value})); }

    async function onSubmit(e){
        e.preventDefault();
        setErrors({}); setMsg("");

        const eobj = {};
        ["name","country","city"].forEach(k => !form[k] && (eobj[k] = "Required"));
        if (!cover) eobj.cover = "Cover photo required";
        if (Object.keys(eobj).length) return setErrors(eobj);

        const fd = new FormData();
        Object.entries(form).forEach(([k,v]) => fd.append(k,v));
        fd.append("cover", cover);

        try {
            await apiPostForm("/api/destinations", fd, { headers: adminHeader() });
            setMsg("Destination created.");
            setForm({ name:"", country:"", city:"", description:"" });
            setCover(null);
        } catch (err) {
            setMsg("");
            setErrors(err.errors || { form: err.message || "Failed to create" });
        }
    }

    return (
        <section className="space-y-6">
            <PageTitle>Add Destination Form</PageTitle>

            <form onSubmit={onSubmit} className="bg-white rounded-xl ring-1 ring-gray-200 p-6 max-w-3xl">
                {msg && <div className="mb-4 text-green-700 bg-green-100 rounded px-3 py-2">{msg}</div>}
                {errors.form && <div className="mb-4 text-red-700 bg-red-100 rounded px-3 py-2">{errors.form}</div>}

                <div className="space-y-4">
                    {["name","country","city"].map((k)=>(
                        <div key={k}>
                            <label className="text-sm font-medium capitalize">{k} *</label>
                            <input name={k} value={form[k]} onChange={onChange}
                                   className="mt-1 w-full border rounded-md h-10 px-3" />
                            {errors[k] && <div className="text-red-600 text-sm mt-1">{errors[k]}</div>}
                        </div>
                    ))}

                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <textarea name="description" value={form.description} onChange={onChange}
                                  className="mt-1 w-full border rounded-md h-32 px-3 py-2" />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Cover Photo *</label>
                        <input type="file" accept="image/*" onChange={(e)=>setCover(e.target.files[0] || null)} />
                        {errors.cover && <div className="text-red-600 text-sm mt-1">{errors.cover}</div>}
                    </div>

                    <div className="flex justify-end">
                        <button className="bg-[#0F766E] text-white px-6 py-2 rounded-lg">Post</button>
                    </div>
                </div>
            </form>
        </section>
    );
}
