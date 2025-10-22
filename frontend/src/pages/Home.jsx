import { Link } from "react-router-dom";
import PageTitle from "../components/PageTitle";
import Carousel from "../components/Carousel";

export default function Home() {
    return (
        <section className="grid grid-cols-1 xl:grid-cols-[1.3fr,0.7fr] gap-10 items-start">
            <div className="space-y-5">
                <PageTitle>Home</PageTitle>
                <Carousel ratio="aspect-[16/9]" />
            </div>

            <aside className="space-y-6">
                {[
                    { to: "/destinations", label: "Browse Destinations" },
                    { to: "/add-entry", label: "Log your travels" },
                    { to: "/destinations", label: "Explore destinations" },
                    { to: "/add-entry", label: "Upload memories" },
                ].map((b) => (
                    <Link
                        key={b.label}
                        to={b.to}
                        className="block rounded-2xl bg-[#F97316] text-white px-7 py-5 shadow-sm hover:brightness-105 transition"
                    >
                        {b.label}
                    </Link>
                ))}
            </aside>
        </section>
    );
}
