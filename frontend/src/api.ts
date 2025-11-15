import axios from "axios";

const base = import.meta.env.VITE_API_URL || "http://localhost:4000";
const api = axios.create({
  baseURL: base.replace(/\/$/, "") + "/api",
});

// add auth header dynamically to avoid header typing issues
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      // ensure headers exists
      if (!config.headers) config.headers = axios.defaults.headers.common;
      // cast to simple record to avoid AxiosHeaders type incompatibilities
      (config.headers as Record<string, string>)[
        "Authorization"
      ] = `Bearer ${token}`;
    }
  } catch (err) {
    // running in non-browser env (build) — ignore
  }
  return config;
});

export default api;
