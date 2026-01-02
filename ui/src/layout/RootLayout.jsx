// frontend/src/layout/RootLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../lib/api";

export default function RootLayout() {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const link =
        "px-4 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition";
    const active = "bg-white/20 text-white";

    const isLoggedIn = !!currentUser;
    const isAdmin = currentUser?.role === "admin";

    // check current user on mount (works for normal login + Google OAuth)
    useEffect(() => {
        async function loadUser() {
            try {
                const res = await apiGet("/api/auth/me");
                setCurrentUser(res.user || null);
            } catch {
                setCurrentUser(null);
            }
        }
        loadUser();
    }, []);

    async function handleLogout(e) {
        e.preventDefault();
        try {
            await apiPost("/api/auth/logout");
            setCurrentUser(null);
            navigate("/");
            window.location.reload();
        } catch (err) {
            console.error("Logout failed:", err);
            alert("Logout failed. Please try again.");
        }
    }

    return (
        <div className="min-h-[100svh] bg-white">
            <div className="w-full min-h-[100svh] flex flex-col">
                {/* NAVBAR */}
                <header className="bg-[#5B5B5B] text-white">
                    <div className="px-12 md:px-16 lg:px-20 h-20 flex flex-col justify-center md:flex-row md:items-center md:justify-between">
                        {/* Title */}
                        <div className="leading-tight">
                            <div className="text-2xl font-semibold tracking-wide">
                                Travel Journal
                            </div>
                            <div
                                style={{ fontFamily: "'Dancing Script', cursive" }}
                                className="text-teal-300 text-sm -mt-1"
                            >
                                Capture and relive your journeys.
                            </div>
                        </div>

                        {/* Links */}
                        <nav className="flex flex-wrap gap-2 mt-3 md:mt-0 items-center">
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) =>
                                    `${link} ${isActive ? active : ""}`
                                }
                            >
                                Home
                            </NavLink>

                            <NavLink
                                to="/destinations"
                                className={({ isActive }) =>
                                    `${link} ${isActive ? active : ""}`
                                }
                            >
                                Destinations
                            </NavLink>

                            <NavLink
                                to="/add-destination"
                                className={({ isActive }) =>
                                    `${link} ${isActive ? active : ""}`
                                }
                            >
                                Add Destination
                            </NavLink>

                            {/* Journal – available to everyone */}
                            <NavLink
                                to="/journals"
                                className={({ isActive }) =>
                                    `${link} ${isActive ? active : ""}`
                                }
                            >
                                Journal
                            </NavLink>

                            {/* Admin-only nav items */}
                            {isAdmin && (
                                <>
                                    <NavLink
                                        to="/moderation"
                                        className={({ isActive }) =>
                                            `${link} ${isActive ? active : ""}`
                                        }
                                    >
                                        Moderation
                                    </NavLink>

                                    <NavLink
                                        to="/users"
                                        className={({ isActive }) =>
                                            `${link} ${isActive ? active : ""}`
                                        }
                                    >
                                        Users
                                    </NavLink>

                                    <NavLink
                                        to="/tags"
                                        className={({ isActive }) =>
                                            `${link} ${isActive ? active : ""}`
                                        }
                                    >
                                        Tags
                                    </NavLink>
                                </>
                            )}

                            {/* Profile link for ANY logged-in user (admin or normal) */}
                            {isLoggedIn && (
                                <NavLink
                                    to="/profile"
                                    className={({ isActive }) =>
                                        `${link} ${isActive ? active : ""}`
                                    }
                                >
                                    Profile
                                </NavLink>
                            )}

                            {/* Auth button */}
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className={`${link} cursor-pointer`}
                                >
                                    Logout
                                </button>
                            ) : (
                                <NavLink to="/login" className={link}>
                                    Login
                                </NavLink>
                            )}
                        </nav>
                    </div>
                </header>

                {/* MAIN */}
                <main className="px-12 md:px-16 lg:px-20 py-8 flex-1">
                    <Outlet />
                </main>

                {/* FOOTER */}
                <footer className="border-t border-gray-200 bg-white/70">
                    <div className="px-12 md:px-16 lg:px-20 py-3 text-sm text-slate-600 text-center">
                        © {new Date().getFullYear()} Travel Journal
                    </div>
                </footer>
            </div>
        </div>
    );
}
