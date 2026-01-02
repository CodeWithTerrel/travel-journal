// frontend/src/lib/api.js

// base API URL from environment variable or default to localhost
export const API_BASE =
    (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/+$/, "");

// handle API response - check for error and parse JSON
async function handle(res) {
    console.log("API Response status:", res.status, res.statusText);

    if (!res.ok) {
        let msg = res.statusText;
        try {
            const j = await res.json();
            console.log("Error response body:", j);
            if (j?.message) msg = j.message;
            throw Object.assign(new Error(msg), j);
        } catch (e) {
            console.error("Failed to parse error:", e);
            throw new Error(msg);
        }
    }

    const ct = res.headers.get("content-type") || "";
    const result = ct.includes("application/json") ? await res.json() : await res.text();
    console.log("API Response data:", result);
    return result;
}

// GET
export function apiGet(path, params) {
    const url = new URL(API_BASE + path);
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
        });
    }
    return fetch(url, { credentials: "include" }).then(handle);
}

// POST (JSON)
export function apiPost(path, body, opts = {}) {
    return fetch(API_BASE + path, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
        credentials: "include",
        body: JSON.stringify(body || {}),
    }).then(handle);
}

// POST (FormData)
export function apiPostForm(path, formData, opts = {}) {
    return fetch(API_BASE + path, {
        method: "POST",
        credentials: "include",
        headers: opts.headers,
        body: formData,
    }).then(handle);
}

// PUT (JSON)
export function apiPut(path, body, opts = {}) {
    return fetch(API_BASE + path, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
        credentials: "include",
        body: JSON.stringify(body || {}),
    }).then(handle);
}

// PATCH (JSON)
export function apiPatch(path, body, opts = {}) {
    return fetch(API_BASE + path, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
        credentials: "include",
        body: JSON.stringify(body || {}),
    }).then(handle);
}

// DELETE
export function apiDelete(path, opts = {}) {
    return fetch(API_BASE + path, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
        credentials: "include",
    }).then(handle);
}

// Build full image URL
export function buildImageUrl(p) {
    console.log("buildImageUrl input:", p);

    if (!p) {
        console.log("No path provided");
        return "";
    }

    const str = String(p).trim();

    if (/^https?:\/\//i.test(str)) {
        console.log("Already absolute URL:", str);
        return str;
    }

    let rel = str.replace(/^\/+/, "");
    if (!rel.startsWith("uploads/")) {
        rel = "uploads/" + rel;
    }

    const finalUrl = `${API_BASE}/${rel}`;
    console.log("Built URL:", finalUrl);
    return finalUrl;
}
