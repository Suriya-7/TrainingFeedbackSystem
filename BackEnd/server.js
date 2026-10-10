// MUST be the first import: loads .env before any other module is evaluated,
// so modules that read process.env at load time see the real values.
import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/oracleDb.js";
import authRoutes from "./routes/authRoutes.js";
import trainingRoutes from "./routes/trainingRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import { adminLogin } from "./controllers/authController.js";

const app = express();

// Same CORS allowlist as the original project (add your real origins here)
const allowedOrigins = [
  "http://localhost:5173",
  "https://dietechindiafeedbackfrom.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trainings", trainingRoutes);
app.use("/api/feedback", feedbackRoutes);

// Your existing frontend (services/authService.js) posts admin login to
// /api/admin/login — keep that URL working so no frontend change is needed.
app.post("/api/admin/login", adminLogin);

app.get("/", (req, res) => res.send("Training Feedback API is Running..."));
app.get("/api/health", (req, res) => res.json({ success: true, message: "OK" }));

// Last-resort error handler: always answer with JSON (Express's default is HTML)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message?.startsWith("ORA-")
      ? "Database error. Please try again."
      : err.message || "Server error.",
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
});
