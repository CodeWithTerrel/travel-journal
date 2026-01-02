import { useEffect } from "react";

export default function Toast({ type = "info", message, onClose, ms = 2500 }) {
    useEffect(() => {
        if (!message) return;
        const t = setTimeout(onClose, ms);
        return () => clearTimeout(t);
    }, [message, ms, onClose]);

    if (!message) return null;

    const base = "fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow";
    const tone =
        type === "success"
            ? "bg-green-600 text-white"
            : type === "error"
                ? "bg-red-600 text-white"
                : "bg-slate-800 text-white";

    return <div className={`${base} ${tone}`}>{message}</div>;
}
