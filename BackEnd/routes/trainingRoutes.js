import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  listTrainingTypes,
  createTrainingType,
  renameTrainingType,
  deleteTrainingType,
} from "../controllers/trainingTypeController.js";
import {
  listAssignableEmployees,
  listTrainings,
  getTrainingDetail,
  createTraining,
} from "../controllers/trainingController.js";
import { downloadTrainingPdfs } from "../controllers/pdfController.js";

const router = express.Router();

router.use(protect, requireRole("ADMIN"));

router.get("/types", listTrainingTypes);
router.post("/types", createTrainingType);
router.put("/types/:id", renameTrainingType);
router.delete("/types/:id", deleteTrainingType);

router.get("/employees", listAssignableEmployees);

router.get("/", listTrainings);
router.post("/", createTraining);
router.get("/:id", getTrainingDetail);
router.get("/:id/download", downloadTrainingPdfs);

export default router;
