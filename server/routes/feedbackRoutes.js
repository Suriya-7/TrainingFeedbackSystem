import express from "express";
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  deleteFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();

// Create Feedback
router.post("/", createFeedback);

// Get All Feedback
router.get("/", getAllFeedback);

// Get Single Feedback
router.get("/:id", getFeedbackById);

// Delete Feedback
router.delete("/:id", deleteFeedback);

export default router;