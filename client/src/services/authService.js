import api from "./api";

const TOKEN_KEY = "adminToken";

const authService = {
  // Login Admin
  login: async (username, password) => {
    const response = await api.post("/admin/login", {
      username,
      password,
    });

    if (response.data.success) {
      localStorage.setItem(TOKEN_KEY, response.data.token);
    }

    return response.data;
  },

  // Logout Admin
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Get Token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Check Login Status
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default authService;