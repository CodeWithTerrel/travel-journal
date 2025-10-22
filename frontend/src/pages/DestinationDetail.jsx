import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import { apiGet } from "../lib/api";

export default function DestinationDetail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiGet(`/api/destinations/${id}`)
            .then(setData)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Loading…</div>;
    if (!data) return <div>Not found</div>;

    const { destination, entries } = data;

    return (
        <section className="space-y-6">
            <PageTitle>Destination Detail</PageTitle>

            <div className="rounded-xl p-6 bg-[#F97316] text-white space-y-4">
                <div className="rounded-xl overflow-hidden">
                    <div className="aspect-[16/7] bg-white/30">
                        {destination.coverImagePath && (
                            <img src={destination.coverImagePath} className="w-full h-full object-cover" />
                        )}
                    </div>
                </div>
                <div className="text-4xl font-semibold">{destination.name}</div>
                <div className="italic text-2xl opacity-95">
                    {destination.city}, {destination.country}
                </div>
                <p className="text-white/95 leading-relaxed">{destination.description || "—"}</p>
            </div>

            <div className="space-y-4">
                <div className="text-xl font-semibold">Approved Journal Entries</div>
                {entries.length === 0 ? (
                    <div className="text-slate-500">No entries yet.</div>
                ) : (
                    <ul className="space-y-3">
                        {entries.map((e) => (
                            <li key={e.id} className="bg-white rounded-lg ring-1 ring-gray-200 p-4">
                                <div className="font-medium">{e.title}</div>
                                <div className="text-sm text-slate-600">
                                    {e.authorDisplay} • {new Date(e.visitDate).toLocaleDateString()} • ⭐ {e.rating}
                                </div>
                                {e.photoPaths && JSON.parse(e.photoPaths).length > 0 && (
                                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {JSON.parse(e.photoPaths).map((p, i) => (
                                            <img key={i} src={p} className="w-full h-32 object-cover rounded-md" />
                                        ))}
                                    </div>
                                )}
                                {e.body && <p className="mt-3">{e.body}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
