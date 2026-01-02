import { Link } from "react-router-dom";

// breadcrumb navigation component - show where user is in the site
export default function Breadcrumb({ items = [] }) {
    return (
        <nav className="text-teal-600 text-sm mt-2">
            {items.map((it, i) => (
                <span key={i}>
                    {it.to ? (
                        // if item has a link, make it clickable
                        <Link to={it.to} className="underline">
                            {it.label}
                        </Link>
                    ) : (
                        // otherwise just show the text
                        it.label
                    )}
                    {/* add separator between item */}
                    {i < items.length - 1 && " > "}
                </span>
            ))}
        </nav>
    );
}