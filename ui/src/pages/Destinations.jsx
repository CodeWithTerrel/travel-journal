// ui/src/pages/Destinations.jsx
import { useMemo, useState } from "react";
import PageTitle from "../components/PageTitle";
import DestinationCard from "../components/DestinationCard";
import { useDestinations } from "../hooks/useDestinations";

const COUNTRIES = ["Canada", "Cameroon", "Nigeria", "America", "France"];
const PAGE_SIZE = 9; // how many items per page

export default function Destinations() {
    // what the user is editing in the filter
    const [draft, setDraft] = useState({
        country: "",
        minRating: "",
        hasComments: "",
    });

    // rating options for dropdown
    const ratingOptions = useMemo(() => ["", 1, 2, 3, 4, 5], []);

    // custom hook handles API calls + pagination
    const { data, page, setPage, setFilters } = useDestinations(
        {
            status: "approved",
            country: "",
            minRating: "",
            hasComments: "",
        },
        1,
        PAGE_SIZE
    );

    // apply the draft filter to the actual query
    function apply(e) {
        e?.preventDefault?.();
        setFilters({
            status: "approved",
            country: draft.country,
            minRating: draft.minRating,
            hasComments: draft.hasComments,
        });
        setPage(1); // reset to first page
    }

    return (
        <section className="space-y-6">
            <PageTitle>Discover Destinations</PageTitle>

            {/* Filter form - country, rating, comment */}
            <form
                onSubmit={apply}
                className="bg-[#27323c] text-white rounded-xl p-5 flex items-end gap-6 flex-wrap"
            >
                {/* Country filter dropdown */}
                <div>
                    <div className="text-sm mb-1">Country</div>
                    <select
                        className="rounded-full h-10 px-4 bg-white text-gray-800"
                        value={draft.country}
                        onChange={(e) =>
                            setDraft((d) => ({ ...d, country: e.target.value }))
                        }
                    >
                        <option value="">--Not Selected--</option>
                        {COUNTRIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Rating filter dropdown */}
                <div>
                    <div className="text-sm mb-1">Rating</div>
                    <select
                        className="rounded-full h-10 px-4 bg-white text-gray-800"
                        value={draft.minRating}
                        onChange={(e) =>
                            setDraft((d) => ({ ...d, minRating: e.target.value }))
                        }
                    >
                        {ratingOptions.map((r) => (
                            <option key={r || "any"} value={r}>
                                {r === "" ? "Any" : `${r}+`}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Comment filter dropdown */}
                <div>
                    <div className="text-sm mb-1">Comments</div>
                    <select
                        className="rounded-full h-10 px-4 bg-white text-gray-800"
                        value={draft.hasComments}
                        onChange={(e) =>
                            setDraft((d) => ({ ...d, hasComments: e.target.value }))
                        }
                    >
                        <option value="">--Not Selected--</option>
                        <option value="true">Has comments</option>
                        <option value="false">No comments</option>
                    </select>
                </div>

                {/* Apply button */}
                <button
                    className="ml-auto rounded-full bg-white text-gray-900 px-5 py-2"
                    type="submit"
                >
                    Apply
                </button>
            </form>

            {/* Grid of destination cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.items
                    .filter(Boolean) // drops any null / undefined just in case
                    .map((dest) => (
                        <DestinationCard key={dest.id} destination={dest} />
                    ))}
            </div>

            {/* Pagination control */}
            <div className="flex items-center justify-center gap-4">
                <button
                    className="bg-gray-500/70 text-white px-4 py-2 rounded disabled:opacity-40"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                    Prev
                </button>
                <span className="text-sm text-slate-600">
                    Page {page} of {data.totalPages || 1}
                </span>
                <button
                    className="bg-gray-500/70 text-white px-4 py-2 rounded disabled:opacity-40"
                    disabled={page >= (data.totalPages || 1)}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>
        </section>
    );
}
