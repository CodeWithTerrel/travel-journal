const KEY = "tj_admin";
export const isAdmin = () => localStorage.getItem(KEY) === "true";
export const setAdmin = (flag) => localStorage.setItem(KEY, flag ? "true" : "false");
export const adminHeader = () => (isAdmin() ? { "x-admin": "true" } : {});
