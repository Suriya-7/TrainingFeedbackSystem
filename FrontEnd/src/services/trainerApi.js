import api from "./api.js";

// One shared trainer list for all plants.
export const getTrainers = () => api.get("/trainers").then((r) => r.data);

// Employees of ALL plants (for the "add trainer" picker). Returns up to 50 + the total match count.
export const searchEmployeesForTrainer = ({ q = "", plant = "" } = {}) =>
  api.get("/trainers/employees", { params: { q, plant } }).then((r) => r.data);

export const addTrainer = (employeeNo) => api.post("/trainers", { employeeNo }).then((r) => r.data);

export const removeTrainer = (employeeNo) =>
  api.delete(`/trainers/${encodeURIComponent(employeeNo)}`).then((r) => r.data);

// One-time: make everyone the employee system flags as a trainer a trainer here.
export const importTrainers = () => api.post("/trainers/import").then((r) => r.data);
