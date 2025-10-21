export default function DestinationDetail() {
    return (
        <section className="space-y-6">
            <div className="inline-block bg-[#0F766E] text-white text-2xl px-6 py-2 rounded-full">
                Destination Detail
            </div>
            <div className="text-[#14B8A6]">Home &gt; Destinations &gt; Details</div>

            <div className="rounded-xl p-6 bg-[#F97316] text-white space-y-4">
                <div className="rounded-xl overflow-hidden">
                    <div className="aspect-[16/7] bg-white/30"></div>
                </div>
                <div className="text-4xl font-semibold">Canadian Museum</div>
                <div className="italic text-2xl opacity-95">Manitoba, Canada</div>
                <p className="text-white/95 leading-relaxed">
                    Body text placeholder to match your orange panel design…
                </p>
            </div>
        </section>
    );
}
