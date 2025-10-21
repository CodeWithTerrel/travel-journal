import { NavLink, Outlet } from "react-router-dom";

const linkBase =
    "px-4 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition";
const active =
    "bg-white/20 text-white";

export default function RootLayout() {
    return (
        <div className="min-h-screen bg-[#FAFAF9] text-slate-700">
            {/* NAVBAR */}
            <header className="bg-[#5B5B5B] text-white">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="text-2xl font-semibold tracking-wide">
                        <span className="mr-2">Travel Journal</span>
                    </div>
                    <nav className="flex gap-2">
                        <NavLink to="/" end className={({isActive}) => `${linkBase} ${isActive ? active : ""}`}>Home</NavLink>
                        <NavLink to="/destinations" className={({isActive}) => `${linkBase} ${isActive ? active : ""}`}>Destinations</NavLink>
                        <NavLink to="/add-destination" className={({isActive}) => `${linkBase} ${isActive ? active : ""}`}>Add Destination</NavLink>
                        <NavLink to="/add-entry" className={({isActive}) => `${linkBase} ${isActive ? active : ""}`}>Add Entry</NavLink>
                        <NavLink to="/login" className={({isActive}) => `${linkBase} ${isActive ? active : ""}`}>Login</NavLink>
                    </nav>
                </div>
            </header>

            {/* PAGE CONTENT */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                <Outlet />
            </main>

            {/* FOOTER */}
            <footer className="border-t border-gray-200 bg-white/70 mt-12">
                <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600">
                    © {new Date().getFullYear()} Travel Journal
                </div>
            </footer>
        </div>
    );
}
