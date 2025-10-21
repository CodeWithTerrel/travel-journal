export default function AddEntry() {
    return (
        <section className="space-y-6">
            <div className="inline-block bg-[#0F766E] text-white text-2xl px-6 py-2 rounded-full">
                Add Journal Entry
            </div>
            <div className="bg-white rounded-xl ring-1 ring-gray-200 p-6 max-w-3xl mx-auto">
                <p className="text-sm text-slate-600 mb-4">Guest posting allowed. Submitted entries appear as pending.</p>
                <div className="space-y-4">
                    {["Destination","Title","Visit Date","Rating (1–5)","Notes"].map((label)=>(
                        <div key={label}>
                            <div className="text-sm font-medium mb-1">{label}</div>
                            <div className="h-10 rounded-md border border-slate-300"></div>
                        </div>
                    ))}
                    <div>
                        <div className="text-sm font-medium mb-1">Photos</div>
                        <div className="h-32 rounded-md border border-dashed border-slate-300 grid place-items-center">
                            Upload area
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="bg-[#F97316] text-white px-6 py-2 rounded-lg">Submit</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
