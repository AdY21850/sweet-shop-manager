import axios from "axios";

const api = axios.create({
  baseURL: "https://sweet-shop-manager-production.up.railway.app", // ONLY ONCE
  withCredentials: true,
});

// Attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
