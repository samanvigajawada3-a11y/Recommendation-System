import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://recommendation-system-ebcp.onrender.com/api",
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("streamflix_user");
    }
    return Promise.reject(error);
  }
);

export default api;
