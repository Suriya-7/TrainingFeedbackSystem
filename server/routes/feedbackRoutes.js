import express from "express";
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  deleteFeedback,
} from "../controllers/feedbackController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ================================
// Public Route (Employee)
// ================================
router.post("/", createFeedback);

// ================================
// Protected Routes (Admin)
// ================================
router.get("/", protect, getAllFeedback);

router.get("/:id", protect, getFeedbackById);

router.delete("/:id", protect, deleteFeedback);

export default router;