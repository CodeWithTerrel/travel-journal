export default function Home() {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6 items-start">
            <div className="rounded-xl overflow-hidden shadow-sm">
                <div className="aspect-[16/10] bg-slate-200 flex items-center justify-center text-slate-500">
                    WHEN WE ARE BUILDING THE REMAINING STUFF LET US ADD THE IMAGE IN HERE OKAY PRAISE!
                    WE CAN ALSO MAKE A CAROUSEL
                </div>
            </div>
            <div className="space-y-4">
                {["Browse Destinations","Log your travels","Explore destinations","Upload memories"].map((t) => (
                    <div key={t} className="rounded-2xl bg-[#F97316] text-white px-6 py-5 shadow-sm">
                        {t}
                    </div>
                ))}
            </div>
        </section>
    );
}
