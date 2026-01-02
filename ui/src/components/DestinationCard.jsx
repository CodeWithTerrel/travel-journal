// frontend/src/components/DestinationCard.jsx
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { buildImageUrl } from "../lib/api";

export default function DestinationCard({ destination }) {
    // Guard: if we somehow get here with no destination, render nothing
    if (!destination) {
        return null;
    }

    const imageUrl = buildImageUrl(destination.coverImagePath || "");

    return (
        <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <Link to={`/destinations/${destination.id}`} className="block">
                <div className="relative aspect-[4/3] bg-slate-100">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={destination.name}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                            No image
                        </div>
                    )}
                </div>
            </Link>

            <div className="flex flex-1 flex-col p-4 space-y-2">
                <div>
                    <h3 className="text-base font-semibold text-slate-900">
                        {destination.name}
                    </h3>
                    <p className="text-xs text-slate-600">
                        {destination.city}, {destination.country}
                    </p>
                </div>

                <StarRating value={destination.rating} />

                {destination.ownerName && (
                    <p className="text-xs text-slate-500">
                        Added by{" "}
                        <span className="font-medium">
                            {destination.ownerName}
                        </span>
                    </p>
                )}

                <p className="text-sm text-slate-700 line-clamp-3">
                    {destination.description || "No description provided."}
                </p>

                <div className="mt-auto pt-2">
                    <Link
                        to={`/destinations/${destination.id}`}
                        className="inline-flex items-center rounded-md bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800"
                    >
                        View details
                    </Link>
                </div>
            </div>
        </article>
    );
}
