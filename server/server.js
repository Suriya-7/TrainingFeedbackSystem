import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Training Feedback API is Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});