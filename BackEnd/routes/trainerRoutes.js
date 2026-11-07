import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  listTrainers,
  searchEmployees,
  addTrainer,
  removeTrainer,
  importFlaggedTrainers,
} from "../controllers/trainerController.js";

const router = express.Router();

router.use(protect, requireRole("ADMIN"));

router.get("/", listTrainers); // every trainer, all plants
router.get("/employees", searchEmployees); // employees of all plants (add-trainer picker)
router.post("/", addTrainer);
router.post("/import", importFlaggedTrainers);
router.delete("/:employeeNo", removeTrainer);

export default router;
