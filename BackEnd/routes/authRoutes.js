import express from "express";
import {
  verifyEmployee,
  setEmployeePassword,
  employeeLogin,
  adminLogin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/employee/verify", verifyEmployee);
router.post("/employee/set-password", setEmployeePassword);
router.post("/employee/login", employeeLogin);
router.post("/admin/login", adminLogin);

export default router;
