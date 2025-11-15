import axios from "axios";

const envBase = import.meta.env.VITE_API_URL;
const base = envBase ? envBase.replace(/\/$/, "") : "";

const api = axios.create({
  baseURL: base ? `${base}/api` : "/api",
});

export default api;
