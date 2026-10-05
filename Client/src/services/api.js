import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/v1",

  timeout: 30000,
});

// --------------------------------------------------
// Request Interceptor
// --------------------------------------------------

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --------------------------------------------------
// Response Interceptor
// --------------------------------------------------

let isRedirectingToLogin = false;

API.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      // Prevent multiple API requests from
      // triggering multiple redirects
      if (!isRedirectingToLogin) {
        isRedirectingToLogin = true;

        console.warn("Authentication expired. Logging out...");

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");

        // Redirect only if not already on login page
        if (window.location.pathname !== "/candidatelogin") {
          window.location.replace("/candidatelogin");
        } else {
          isRedirectingToLogin = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default API;