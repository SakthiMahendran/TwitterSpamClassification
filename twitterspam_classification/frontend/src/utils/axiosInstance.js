import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL, // Base URL for the backend
  timeout: 10000, // Timeout for requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
