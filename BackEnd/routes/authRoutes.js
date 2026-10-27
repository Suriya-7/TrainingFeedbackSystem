import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { execute } from "../config/oracle.js";
import { getEmployeeByNo } from "../services/employeeApiService.js";

const router = Router();

// 1) Emp ID entered on the login page
router.post("/employee/check", async (req, res) => {
  const { empNo } = req.body;
  const emp = await getEmployeeByNo(empNo);
  if (!emp) return res.status(404).json({ message: "Employee not found" });

  const r = await execute(
    `SELECT EMPLOYEE_NO FROM EMPLOYEE_CREDENTIALS WHERE EMPLOYEE_NO = :empNo`,
    { empNo: String(empNo) }
  );
  res.json({ name: emp.name, status: r.rows.length ? "needsPassword" : "needsSignup" });
});

// 2) First-time password setup
router.post("/employee/signup", async (req, res) => {
  const { empNo, password } = req.body;
  const emp = await getEmployeeByNo(empNo);
  if (!emp) return res.status(404).json({ message: "Employee not found" });

  const exists = await execute(
    `SELECT 1 FROM EMPLOYEE_CREDENTIALS WHERE EMPLOYEE_NO = :empNo`,
    { empNo: String(empNo) }
  );
  if (exists.rows.length) return res.status(409).json({ message: "Already registered" });

  const hash = await bcrypt.hash(password, 10);
  await execute(
    `INSERT INTO EMPLOYEE_CREDENTIALS (EMPLOYEE_NO, PASSWORD_HASH) VALUES (:empNo, :hash)`,
    { empNo: String(empNo), hash }
  );
  res.status(201).json({ message: "Registered" });
});

// 3) Login
router.post("/employee/login", async (req, res) => {
  const { empNo, password } = req.body;
  const r = await execute(
    `SELECT PASSWORD_HASH FROM EMPLOYEE_CREDENTIALS WHERE EMPLOYEE_NO = :empNo`,
    { empNo: String(empNo) }
  );
  if (!r.rows.length) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, r.rows[0].PASSWORD_HASH);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const emp = await getEmployeeByNo(empNo);
  const token = jwt.sign(
    { id: empNo, role: "employee", plantId: emp.plantCode },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  res.json({ token, employee: emp });
});

export default router;