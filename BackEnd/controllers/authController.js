import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { runQuery, insertOne, raw, isDuplicateError } from "../utils/db.js";
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

    try {
      await insertOne("employee_credentials", "credential_id", {
        employee_no: employee.employeeNo,
        plant_code: employee.plantCode,
        password_hash: passwordHash,
        created_at: raw("SYSTIMESTAMP"),
        updated_at: raw("SYSTIMESTAMP"),
      });
    } catch (insertError) {
      // Double-click / two tabs: the employee_no is already registered.
      if (isDuplicateError(insertError)) {
        return res.status(409).json({ success: false, message: "Password already set. Please log in instead." });
      }
      throw insertError;
    }

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

// ---------------------------------------------------------------------------
// Admin login — one admin account PER PLANT, all read from .env:
//
//   ADMIN_USERNAME_plant1 / ADMIN_PASSWORD_plant1   -> PLANT1
//   ADMIN_USERNAME_plant2 / ADMIN_PASSWORD_plant2   -> PLANT2
//   ADMIN_USERNAME_plant3 / ADMIN_PASSWORD_plant3   -> PLANT3
//
// The text after "ADMIN_USERNAME_" decides the plant (upper/lower case does not
// matter). Adding "plant4" later needs only two new .env lines, no code change.
// The matched plant goes into the login token, so every admin page (employees,
// trainers, trainings, PDFs) automatically shows only that plant's data.
// ---------------------------------------------------------------------------
const toPlantCode = (suffix) => suffix.toUpperCase().replace(/[^A-Z0-9]/g, ""); // "plant1" -> "PLANT1"

function loadAdminAccounts() {
  const keys = Object.keys(process.env);
  const accounts = [];
  for (const key of keys) {
    const match = key.match(/^ADMIN_USERNAME_(.+)$/i);
    if (!match) continue;
    const passwordKey = keys.find((k) => k.toUpperCase() === `ADMIN_PASSWORD_${match[1].toUpperCase()}`);
    const username = process.env[key];
    const password = passwordKey ? process.env[passwordKey] : "";
    if (username && password) accounts.push({ plantCode: toPlantCode(match[1]), username, password });
  }
  return accounts;
}

// Compare secrets without leaking how many characters matched.
const sameSecret = (a, b) =>
  crypto.timingSafeEqual(
    crypto.createHash("sha256").update(String(a)).digest(),
    crypto.createHash("sha256").update(String(b)).digest()
  );

export const adminLogin = (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(401).json({ success: false, message: "Invalid admin credentials." });
  }

  const accounts = loadAdminAccounts();
  if (accounts.length === 0) {
    console.error("adminLogin: no ADMIN_USERNAME_<plant> / ADMIN_PASSWORD_<plant> pairs found in .env");
  }

  // Username AND password must belong to the SAME plant's account.
  const account = accounts.find(
    (a) => sameSecret(username, a.username) && sameSecret(password, a.password)
  );
  if (!account) {
    return res.status(401).json({ success: false, message: "Invalid admin credentials." });
  }

  const token = issueToken({ id: account.username, role: "ADMIN", plantCode: account.plantCode }, "12h");
  return res.json({ success: true, token, plantCode: account.plantCode });
};
