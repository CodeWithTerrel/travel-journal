import PageTitle from "../components/PageTitle";
import { Link } from "react-router-dom";
import Carousel from "../components/Carousel";

// home page - show carousel and quick action button
export default function Home() {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-[1fr,500px] gap-8 items-start">
            {/* Left side - carousel */}
            <div className="space-y-4">
                <PageTitle>Home</PageTitle>
                <Carousel />
            </div>

            {/* Right side - action buttons - bigger and stretched */}
            <aside className="space-y-6">
                <Link
                    to="/destinations"
                    className="block bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-8 py-8 text-xl font-semibold shadow-lg text-center"
                >
                    Browse Destinations
                </Link>

                <Link
                    to="/login"
                    className="block bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-8 py-8 text-xl font-semibold shadow-lg text-center"
                >
                    Login as Admin
                </Link>

                <Link
                    to="/destinations"
                    className="block bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-8 py-8 text-xl font-semibold shadow-lg text-center"
                >
                    Upload memories
                </Link>
            </aside>
        </section>
    );
}