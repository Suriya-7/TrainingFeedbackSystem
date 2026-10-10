import api from "./api.js"; // reuses the existing admin-token axios instance

export const getTrainingTypes = () => api.get("/trainings/types").then((r) => r.data);
export const createTrainingType = (trainingName) =>
  api.post("/trainings/types", { trainingName }).then((r) => r.data);
export const renameTrainingType = (id, trainingName) =>
  api.put(`/trainings/types/${id}`, { trainingName }).then((r) => r.data);
export const deleteTrainingType = (id) =>
  api.delete(`/trainings/types/${id}`).then((r) => r.data);

export const getAssignableEmployees = () =>
  api.get("/trainings/employees").then((r) => r.data);

export const getTrainings = () => api.get("/trainings").then((r) => r.data);
export const getTrainingDetail = (id) => api.get(`/trainings/${id}`).then((r) => r.data);

export const createTraining = (payload) =>
  api.post("/trainings", payload).then((r) => r.data);

export const downloadTrainingZip = (id) =>
  api.get(`/trainings/${id}/download`, { responseType: "blob" });
