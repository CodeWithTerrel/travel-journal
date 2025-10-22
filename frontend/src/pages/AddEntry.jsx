import { useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiPostForm } from "../lib/api";

const init = { destinationId: "", title: "", visitDate: "", rating: 3, body: "", authorDisplay: "" };

export default function AddEntry() {
    const [form, setForm] = useState(init);
    const [photos, setPhotos] = useState([]); // FileList
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    function onChange(e) {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        setErrors({});
        setMessage("");

        // client checks
        const errs = {};
        if (!form.destinationId) errs.destinationId = "Required";
        if (!form.title) errs.title = "Required";
        if (!form.visitDate) errs.visitDate = "Required";
        if (form.rating < 1 || form.rating > 5) errs.rating = "1–5 only";
        if (Object.keys(errs).length) return setErrors(errs);

        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        Array.from(photos).forEach((file) => fd.append("photos", file));

        try {
            await apiPostForm("/api/entries", fd);
            setMessage("Submitted! Your entry is pending approval.");
            setForm(init);
            setPhotos([]);
        } catch (err) {
            setMessage("");
            setErrors(err.errors || { form: err.message || "Failed to submit" });
        }
    }

    return (
        <section className="space-y-6">
            <PageTitle>Add Journal Entry</PageTitle>

            <form onSubmit={onSubmit} className="bg-white rounded-xl ring-1 ring-gray-200 p-6 max-w-3xl">
                {message && <div className="mb-4 text-green-700 bg-green-100 rounded px-3 py-2">{message}</div>}
                {errors.form && <div className="mb-4 text-red-700 bg-red-100 rounded px-3 py-2">{errors.form}</div>}

                <div className="grid gap-4">
                    <div>
                        <label className="text-sm font-medium">Destination ID *</label>
                        <input name="destinationId" value={form.destinationId} onChange={onChange}
                               className="mt-1 w-full border rounded-md h-10 px-3" placeholder="e.g. 1" />
                        {errors.destinationId && <div className="text-red-600 text-sm mt-1">{errors.destinationId}</div>}
                    </div>

                    <div>
                        <label className="text-sm font-medium">Title *</label>
                        <input name="title" value={form.title} onChange={onChange}
                               className="mt-1 w-full border rounded-md h-10 px-3" />
                        {errors.title && <div className="text-red-600 text-sm mt-1">{errors.title}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium">Visit Date *</label>
                            <input type="date" name="visitDate" value={form.visitDate} onChange={onChange}
                                   className="mt-1 w-full border rounded-md h-10 px-3" />
                            {errors.visitDate && <div className="text-red-600 text-sm mt-1">{errors.visitDate}</div>}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Rating (1–5)</label>
                            <input type="number" min="1" max="5" name="rating" value={form.rating} onChange={onChange}
                                   className="mt-1 w-full border rounded-md h-10 px-3" />
                            {errors.rating && <div className="text-red-600 text-sm mt-1">{errors.rating}</div>}
                        </div>
                        <div>
                            <label className="text-sm font-medium">Display Name</label>
                            <input name="authorDisplay" value={form.authorDisplay} onChange={onChange}
                                   className="mt-1 w-full border rounded-md h-10 px-3" placeholder="Guest (optional)" />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Notes</label>
                        <textarea name="body" value={form.body} onChange={onChange}
                                  className="mt-1 w-full border rounded-md h-32 px-3 py-2" />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Photos</label>
                        <input type="file" multiple accept="image/*"
                               onChange={(e) => setPhotos(e.target.files)} className="mt-1 w-full" />
                    </div>

                    <div className="flex justify-end">
                        <button className="bg-[#F97316] text-white px-6 py-2 rounded-lg">Submit</button>
                    </div>
                </div>
            </form>
        </section>
    );
}
