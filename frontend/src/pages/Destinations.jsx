export default function Destinations() {
    return (
        <section className="space-y-6">
            <div className="inline-block bg-[#0F766E] text-white text-2xl px-6 py-2 rounded-full">
                Discover Destinations
            </div>

            <div className="rounded-xl bg-[#2E3741] text-white/90 p-4 flex flex-wrap gap-4 items-center">
                <div className="space-y-1">
                    <div className="text-sm">Country</div>
                    <div className="bg-white text-slate-700 px-3 py-2 rounded-md w-56">--Not Selected--</div>
                </div>
                <div className="space-y-1">
                    <div className="text-sm">Rating</div>
                    <div className="bg-white text-slate-700 px-3 py-2 rounded-md w-40">5 - Stars</div>
                </div>
                <div className="space-y-1">
                    <div className="text-sm">Comments</div>
                    <div className="bg-white text-slate-700 px-3 py-2 rounded-md w-56">--Not Selected--</div>
                </div>
                <button className="ml-auto bg-white text-slate-900 px-5 py-2 rounded-full">Apply</button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_,i)=>(
                    <div key={i} className="rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-200">
                        <div className="aspect-[16/9] bg-slate-200"></div>
                        <div className="grid grid-cols-[1fr,120px]">
                            <div className="p-4">
                                <div className="font-semibold text-lg">Canadian Museum</div>
                                <div className="italic text-slate-600">Manitoba, Canada</div>
                                <p className="text-sm mt-2 line-clamp-3">Card text placeholder matching your mockup.</p>
                            </div>
                            <div className="bg-[#F97316] text-white flex items-end justify-center p-4">
                                <span className="underline">View Details</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
