import { Link } from "react-router-dom";

export default function Breadcrumb({ items = [] }) {
    return (
        <nav className="text-teal-600 text-sm mt-2">
            {items.map((it, i) => (
                <span key={i}>
          {it.to ? (
              <Link to={it.to} className="underline">
                  {it.label}
              </Link>
          ) : (
              it.label
          )}
                    {i < items.length - 1 && " > "}
        </span>
            ))}
        </nav>
    );
}
