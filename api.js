"import axios from \"axios\";

const BASE = process.env.REACT_APP_BACKEND_URL;
export const API = `${BASE}/api`;

export const http = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Attach token from localStorage as fallback (cookies for same-site)
http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem(\"wc_token\");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export function formatApiError(detail) {
  if (detail == null) return \"Something went wrong.\";
  if (typeof detail === \"string\") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === \"string\" ? e.msg : JSON.stringify(e))).join(\" \");
  if (detail && typeof detail.msg === \"string\") return detail.msg;
  return String(detail);
}
"