import { NavLink, Outlet } from "react-router-dom";

export default function RootLayout() {
    const link = "px-4 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition";
    const active = "bg-white/20 text-white";

    return (
        // Make the browser background the same as the page
        <div className="min-h-[100svh] bg-white">
            {/* Container with more side padding */}
            <div className="w-full min-h-[100svh] flex flex-col">
                {/* NAVBAR */}
                <header className="bg-[#5B5B5B] text-white">
                    <div className="px-12 md:px-16 lg:px-20 h-20 flex flex-col justify-center md:flex-row md:items-center md:justify-between">
                        <div className="leading-tight">
                            <div className="text-2xl font-semibold tracking-wide">Travel Journal</div>
                            <div style={{ fontFamily: "'Dancing Script', cursive" }} className="text-teal-300 text-sm -mt-1">
                                Capture and relive your journeys.
                            </div>
                        </div>
                        <nav className="flex flex-wrap gap-2 mt-3 md:mt-0">
                            <NavLink to="/" end        className={({isActive}) => `${link} ${isActive ? active : ""}`}>Home</NavLink>
                            <NavLink to="/destinations" className={({isActive}) => `${link} ${isActive ? active : ""}`}>Destinations</NavLink>
                            <NavLink to="/add-destination" className={({isActive}) => `${link} ${isActive ? active : ""}`}>Add Destination</NavLink>
                            <NavLink to="/add-entry" className={({isActive}) => `${link} ${isActive ? active : ""}`}>Add Entry</NavLink>
                            <NavLink to="/login" className={({isActive}) => `${link} ${isActive ? active : ""}`}>Login</NavLink>
                        </nav>
                    </div>
                </header>

                {/* MAIN fills all remaining height with increased padding */}
                <main className="px-12 md:px-16 lg:px-20 py-8 flex-1">
                    <Outlet />
                </main>

                {/* FOOTER glued to bottom */}
                <footer className="border-t border-gray-200 bg-white/70">
                    <div className="px-12 md:px-16 lg:px-20 py-3 text-sm text-slate-600 text-center">
                        © {new Date().getFullYear()} Travel Journal
                    </div>
                </footer>
            </div>
        </div>
    );
}