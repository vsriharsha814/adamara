import axios from "axios";

const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

export const api = axios.create({
  baseURL: `${baseUrl}/api`,
});

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("authToken");
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("authToken");
}

export function authHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

