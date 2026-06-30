import axios from "axios";

// ponytail: prod serves the frontend from the backend (same origin) => baseURL "".
// Local dev sets VITE_API_URL in .env.development to hit the separate API on :8000.
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "",
});
