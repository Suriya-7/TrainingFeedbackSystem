import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { runQuery } from "../utils/db.js";
import { fetchEmployeeByNo } from "../services/employeeApiService.js";

function issueToken(payload, expiresIn) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

// STEP 1 — employee types their Employee No.
export const verifyEmployee = async (req, res) => {
  try {
    const { employeeNo } = req.body;
    if (!employeeNo?.trim()) {
      return res.status(400).json({ success: false, message: "Employee number is required." });
    }

    const employee = await fetchEmployeeByNo(employeeNo.trim());
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    const result = await runQuery(
      `SELECT credential_id FROM employee_credentials WHERE employee_no = :employeeNo`,
      { employeeNo: employee.employeeNo }
    );

    return res.json({
      success: true,
      employeeNo: employee.employeeNo,
      fullName: employee.fullName,
      department: employee.department,
      hasPassword: result.rows.length > 0,
    });
  } catch (error) {
    console.error("verifyEmployee error:", error.message);
    return res.status(error.status || 500).json({
      success: false,
      message: error.status === 502 ? error.message : "Something went wrong. Try again.",
    });
  }
};

// STEP 2a — first login: employee sets a password.
export const setEmployeePassword = async (req, res) => {
  try {
    const { employeeNo, password } = req.body;
    if (!employeeNo?.trim() || !password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Employee number and a password of at least 6 characters are required.",
      });
    }

    // Re-verify server-side — never trust the client's claimed employeeNo alone.
    const employee = await fetchEmployeeByNo(employeeNo.trim());
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found." });
    }

    const existing = await runQuery(
      `SELECT credential_id FROM employee_credentials WHERE employee_no = :employeeNo`,
      { employeeNo: employee.employeeNo }
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Password already set. Please log in instead." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await runQuery(
      `INSERT INTO employee_credentials (employee_no, plant_code, password_hash)
       VALUES (:employeeNo, :plantCode, :passwordHash)`,
      { employeeNo: employee.employeeNo, plantCode: employee.plantCode, passwordHash }
    );

    const token = issueToken(
      { id: employee.employeeNo, role: "EMPLOYEE", plantCode: employee.plantCode },
      "8h"
    );

    return res.status(201).json({ success: true, token, fullName: employee.fullName });
  } catch (error) {
    console.error("setEmployeePassword error:", error.message);
    return res.status(error.status || 500).json({
      success: false,
      message: error.status === 502 ? error.message : "Something went wrong. Try again.",
    });
  }
};

// STEP 2b — returning employee logs in.
export const employeeLogin = async (req, res) => {
  try {
    const { employeeNo, password } = req.body;
    if (!employeeNo?.trim() || !password) {
      return res.status(400).json({ success: false, message: "Employee number and password are required." });
    }

    const result = await runQuery(
      `SELECT password_hash, plant_code FROM employee_credentials WHERE employee_no = :employeeNo`,
      { employeeNo: employeeNo.trim() }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "No password set yet for this employee." });
    }

    const { PASSWORD_HASH, PLANT_CODE: plantCode } = result.rows[0];
    const match = await bcrypt.compare(password, PASSWORD_HASH);
    if (!match) {
      return res.status(401).json({ success: false, message: "Incorrect password." });
    }

    await runQuery(
      `UPDATE employee_credentials SET last_login_at = SYSTIMESTAMP WHERE employee_no = :employeeNo`,
      { employeeNo: employeeNo.trim() }
    );

    const token = issueToken({ id: employeeNo.trim(), role: "EMPLOYEE", plantCode }, "8h");

    return res.json({ success: true, token });
  } catch (error) {
    console.error("employeeLogin error:", error.message);
    return res.status(error.status || 500).json({
      success: false,
      message: error.status === 502 ? error.message : "Something went wrong. Try again.",
    });
  }
};

// Admin login — single plant for now, credentials from .env.
export const adminLogin = (req, res) => {
  const { username, password } = req.body;

  if (
    !username ||
    !password ||
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ success: false, message: "Invalid admin credentials." });
  }

  // Read at call time (single plant for now, e.g. "PLANT1")
  const token = issueToken({ id: username, role: "ADMIN", plantCode: process.env.PLANT_CODE }, "12h");

  return res.json({ success: true, token });
};
