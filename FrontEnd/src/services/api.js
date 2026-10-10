import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // A 401 from the login call itself means "wrong username/password" — let the
    // login page show that message instead of reloading the page.
    const isLoginCall = error.config?.url?.includes("/login");

    if (error.response?.status === 401 && !isLoginCall) {
      localStorage.removeItem("adminToken");

      // Redirect to login
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default api;
