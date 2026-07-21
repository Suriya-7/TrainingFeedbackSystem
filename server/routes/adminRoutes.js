import express from "express";
import {
  loginAdmin,
  getAllFeedbacks,
  getFeedbackById,
  deleteFeedback,
} from "../controllers/adminController.js";

import  protect  from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   PUBLIC ROUTE
=========================== */

router.post("/login", loginAdmin);

/* ===========================
   PROTECTED ROUTES
=========================== */

// Get all feedbacks
router.get("/feedbacks", protect, getAllFeedbacks);

// Get single feedback
router.get("/feedbacks/:id", protect, getFeedbackById);

// Delete feedback
router.delete("/feedbacks/:id", protect, deleteFeedback);

export default router;