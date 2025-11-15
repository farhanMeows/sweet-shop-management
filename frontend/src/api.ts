// frontend/src/api.ts
import axios from "axios";

const base = import.meta.env.VITE_API_URL || "http://localhost:4000";
const api = axios.create({
  baseURL: base.replace(/\/$/, "") + "/api",
});

api.interceptors.request.use((config) => {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      if (!config.headers) {
        (config as any).headers = {};
      }
      // assign using a cast to any to avoid strict Axios types during build
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }
  } catch (err) {
    // ignore during build / tests
  }
  return config;
});

export default api;
