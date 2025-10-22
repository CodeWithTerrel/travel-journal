const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

// get JSON
export async function apiGet(path) {
    const r = await fetch(`${BASE}${path}`);
    if (!r.ok) throw await r.json().catch(() => ({ message: r.statusText }));
    return r.json();
}

// post JSON
export async function apiPost(path, body, opts = {}) {
    const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
    const r = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    if (!r.ok) throw await r.json().catch(() => ({ message: r.statusText }));
    return r.json();
}

// post FormData (for uploads)
export async function apiPostForm(path, formData, opts = {}) {
    const r = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: opts.headers, // don't set content-type for FormData
        body: formData,
    });
    if (!r.ok) throw await r.json().catch(() => ({ message: r.statusText }));
    return r.json();
}

// patch JSON
export async function apiPatch(path, body, opts = {}) {
    const headers = { "Content-Type": "application/json", ...(opts.headers || {}) };
    const r = await fetch(`${BASE}${path}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(body),
    });
    if (!r.ok) throw await r.json().catch(() => ({ message: r.statusText }));
    return r.json();
}
