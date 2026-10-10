import axios from "axios";

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("employeeToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only treat 401 as "session expired" for normal requests. A 401 from the
    // login endpoint just means "wrong password" — let the page show that message.
    const isAuthCall = error.config?.url?.includes("/auth/");
    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem("employeeToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export const verifyEmployee = (employeeNo) =>
  api.post("/auth/employee/verify", { employeeNo }).then((r) => r.data);

export const setEmployeePassword = (employeeNo, password) =>
  api.post("/auth/employee/set-password", { employeeNo, password }).then((r) => r.data);

export const employeeLogin = (employeeNo, password) =>
  api.post("/auth/employee/login", { employeeNo, password }).then((r) => r.data);

export const getPendingFeedback = () =>
  api.get("/feedback/pending").then((r) => r.data);

export const getFeedbackRecord = (id) =>
  api.get(`/feedback/${id}`).then((r) => r.data);

export const submitFeedback = (id, payload) =>
  api.post(`/feedback/${id}/submit`, payload).then((r) => r.data);

export default api;
