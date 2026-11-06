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

  // Plant this admin belongs to, e.g. "Plant 1" (read from the login token)
  getPlantName: () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return "";
      const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
      return String(payload.plantCode || "").replace(/^PLANT(\d+)$/i, "Plant $1");
    } catch {
      return "";
    }
  },

  // Check Login Status
  isAuthenticated: () => {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

export default authService;