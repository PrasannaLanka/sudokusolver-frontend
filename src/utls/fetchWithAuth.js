// src/utils/fetchWithAuth.js


export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem("token");
  if (!options.headers) options.headers = {};
  if (token) options.headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, options);

  if (res.status === 401) {
    // Unauthorized: token invalid or expired
    localStorage.removeItem("token");
    window.location.href = "/login";
    return null;
  }

  return res;
}
