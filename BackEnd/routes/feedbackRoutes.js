import express from "express";
import { protect, requireRole } from "../middleware/authMiddleware.js";
import {
  listMyPendingFeedback,
  getFeedbackRecord,
  submitFeedback,
} from "../controllers/feedbackController.js";

const router = express.Router();

router.use(protect, requireRole("EMPLOYEE"));

router.get("/pending", listMyPendingFeedback);
router.get("/:id", getFeedbackRecord);
router.post("/:id/submit", submitFeedback);

export default router;
