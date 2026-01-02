// src/lib/auth.js
const KEY = "tj_admin";

/** Current admin flag (from localStorage) */
export const isAdmin = () => localStorage.getItem(KEY) === "true";

/** Set/unset admin and notify listeners/UI */
export const setAdmin = (flag) => {
    localStorage.setItem(KEY, flag ? "true" : "false");
    // Tell the app something changed (same-tab)
    window.dispatchEvent(new Event("tj-auth-changed"));
};

/** Subscribe to admin changes (same-tab & cross-tab) */
export function onAuthChange(cb) {
    const handler = () => cb(isAdmin());
    window.addEventListener("tj-auth-changed", handler);
    // cross-tab support
    const storageHandler = (e) => {
        if (e.key === KEY) handler();
    };
    window.addEventListener("storage", storageHandler);
    return () => {
        window.removeEventListener("tj-auth-changed", handler);
        window.removeEventListener("storage", storageHandler);
    };
}

/** Helper: header to call admin endpoints */
export const adminHeader = () => (isAdmin() ? { "x-admin": "true" } : {});
