import { Router } from "express";
import {
  verifyEmployee,
  setEmployeePassword,
  employeeLogin,
} from "../controllers/authController.js";

const router = Router();

// Mounted at /api/auth in server.js. These are the exact paths
// FrontEnd/src/services/employeeApi.js calls.
router.post("/employee/verify", verifyEmployee);          // step 1: emp no -> name + hasPassword
router.post("/employee/set-password", setEmployeePassword); // step 2a: first login
router.post("/employee/login", employeeLogin);            // step 2b: returning employee

export default router;
