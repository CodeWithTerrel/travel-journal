import { useEffect, useState } from "react";
import PageTitle from "../components/PageTitle";
import { apiGet } from "../lib/api";
import { Link } from "react-router-dom";

export default function Destinations() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiGet("/api/destinations")
            .then(setItems)
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="space-y-6">
            <PageTitle>Discover Destinations</PageTitle>

            {/* simple filter bar placeholder (same look as mockup) */}
            <div className="rounded-xl bg-[#2E3741] text-white/90 p-4 flex flex-wrap gap-4 items-center">
                <div className="space-y-1">
                    <div className="text-sm">Country</div>
                    <div className="bg-white text-slate-700 px-3 py-2 rounded-md w-56">--Not Selected--</div>
                </div>
                <div className="space-y-1">
                    <div className="text-sm">Rating</div>
                    <div className="bg-white text-slate-700 px-3 py-2 rounded-md w-40">Any</div>
                </div>
                <button className="ml-auto bg-white text-slate-900 px-5 py-2 rounded-full">Apply</button>
            </div>

            {loading ? (
                <div className="text-slate-500">Loading…</div>
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((d) => (
                        <div key={d.id} className="rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-200">
                            <div className="aspect-[16/9] bg-slate-200">
                                {d.coverImagePath && <img src={d.coverImagePath} className="w-full h-full object-cover" />}
                            </div>
                            <div className="grid grid-cols-[1fr,130px]">
                                <div className="p-4">
                                    <div className="font-semibold text-lg">{d.name}</div>
                                    <div className="italic text-slate-600">
                                        {d.city}, {d.country}
                                    </div>
                                </div>
                                <Link to={`/destinations/${d.id}`} className="bg-[#F97316] text-white flex items-end justify-center p-4 underline">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
