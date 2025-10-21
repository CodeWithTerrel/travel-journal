export default function AddDestination() {
    return (
        <section className="space-y-6">
            <div className="inline-block bg-[#0F766E] text-white text-2xl px-6 py-2 rounded-full">
                Add Destination Form
            </div>

            <div className="bg-white rounded-xl ring-1 ring-gray-200 p-6 max-w-3xl mx-auto">
                <p className="text-sm text-slate-600 mb-4">(*) Required fields</p>
                <div className="space-y-4">
                    {["Name *","Country *","City *","Description"].map((label)=>(
                        <div key={label}>
                            <div className="text-sm font-medium mb-1">{label}</div>
                            <div className="h-10 rounded-md border border-slate-300"></div>
                        </div>
                    ))}
                    <div>
                        <div className="text-sm font-medium mb-1">Cover Photo *</div>
                        <div className="h-32 rounded-md border border-dashed border-slate-300 grid place-items-center">
                            Drag & Drop files here
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="bg-[#0F766E] text-white px-6 py-2 rounded-lg">Post</button>
                    </div>
                </div>
            </div>
        </section>
    );
}
