import axios from "axios";

// Creating a global reusable network pipeline configuration instance
const API = axios.create({
  baseURL:  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1", // Points directly to your completed Node.js API
  timeout: 10000, // Safe timeout barrier of 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatic request Interceptor to attach the JWT Token if present in LocalStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attaches credential passes seamlessly
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/candidatelogin"; // ya jo bhi login route hai
    }
    return Promise.reject(error);
  }
);

export default API;