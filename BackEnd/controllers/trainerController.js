import { runQuery, insertOne, raw, isDuplicateError } from "../utils/db.js";
import { fetchAllEmployees, fetchEmployeeByNo } from "../services/employeeApiService.js";

/* ------------------------------------------------------------------ *
 *  TRAINERS (managed by HR / plant admins, shared by all 3 plants)
 *
 *  - The trainer list is ONE list for every plant. Any plant's HR can add
 *    or remove any employee of any plant.
 *  - "Remove" never deletes a row (the app has no DELETE right): it sets
 *    IS_ACTIVE = 0. Adding the same person again just switches it back on.
 *  - Old trainings keep working after a trainer is removed.
 * ------------------------------------------------------------------ */

const pageSize = 50;

// If the DB team has not created the table yet, say so clearly.
const tableMissing = (error) => /ORA-00942/.test(String(error?.message));
const sendTableMissing = (res) =>
  res.status(500).json({
    success: false,
    message: "The TRAINERS table does not exist yet. Ask the DB team to run BackEnd/sql/trainers.sql.",
  });

// Run a handler body; turn a missing table into a clear message.
const guarded = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    if (tableMissing(error)) return sendTableMissing(res);
    throw error; // Express 5 forwards async errors to the JSON error handler
  }
};

const activeTrainerNos = async () => {
  const result = await runQuery(`SELECT employee_no FROM trainers WHERE is_active = 1`);
  return new Set(result.rows.map((r) => String(r.EMPLOYEE_NO).trim().toUpperCase()));
};

const publicEmployee = (e) => ({
  employeeNo: e.employeeNo,
  fullName: e.fullName,
  department: e.department,
  plantCode: e.plantCode,
});

// Current trainers of ALL plants, newest first.
export const listTrainers = guarded(async (req, res) => {
  const result = await runQuery(
    `SELECT employee_no, added_by_plant, created_at
       FROM trainers WHERE is_active = 1 ORDER BY created_at DESC`
  );

  const data = await Promise.all(
    result.rows.map(async (row) => {
      let e = null;
      try {
        e = await fetchEmployeeByNo(row.EMPLOYEE_NO);
      } catch {
        /* employee API down: show the number only */
      }
      return {
        employeeNo: row.EMPLOYEE_NO,
        fullName: e?.fullName || null,
        department: e?.department || null,
        plantCode: e?.plantCode || null,
        addedByPlant: row.ADDED_BY_PLANT,
        createdAt: row.CREATED_AT,
      };
    })
  );

  res.json({ success: true, data });
});

// Employees of every plant that can be made trainers (search + plant filter).
export const searchEmployees = guarded(async (req, res) => {
  const q = String(req.query.q || "").trim().toLowerCase();
  const plant = String(req.query.plant || "").toUpperCase().replace(/[^A-Z0-9]/g, "");

  const [all, trainers] = await Promise.all([fetchAllEmployees(), activeTrainerNos()]);

  const matches = all.filter((e) => {
    if (plant && e.plantCode !== plant) return false;
    if (!q) return true;
    return (
      e.fullName.toLowerCase().includes(q) ||
      e.employeeNo.toLowerCase().includes(q) ||
      String(e.department || "").toLowerCase().includes(q)
    );
  });

  res.json({
    success: true,
    total: matches.length,
    data: matches
      .slice(0, pageSize)
      .map((e) => ({ ...publicEmployee(e), isTrainer: trainers.has(e.employeeNo.toUpperCase()) })),
  });
});

export const addTrainer = guarded(async (req, res) => {
  const employeeNo = String(req.body?.employeeNo || "").trim();
  if (!employeeNo) {
    return res.status(400).json({ success: false, message: "Employee number is required." });
  }

  // Must be a real employee (of any plant).
  const employee = await fetchEmployeeByNo(employeeNo);
  if (!employee) {
    return res.status(404).json({ success: false, message: "Employee not found." });
  }

  const existing = await runQuery(
    `SELECT is_active FROM trainers WHERE UPPER(employee_no) = :employeeNo`,
    { employeeNo: employee.employeeNo.toUpperCase() }
  );

  if (existing.rows.length > 0) {
    if (Number(existing.rows[0].IS_ACTIVE) === 1) {
      return res.status(409).json({ success: false, message: `${employee.fullName} is already a trainer.` });
    }
    // Was removed earlier: switch the same row back on.
    await runQuery(
      `UPDATE trainers SET is_active = 1, added_by_plant = :plant, updated_at = SYSTIMESTAMP
        WHERE UPPER(employee_no) = :employeeNo`,
      { plant: req.user.plantCode, employeeNo: employee.employeeNo.toUpperCase() }
    );
    return res.status(201).json({ success: true, data: publicEmployee(employee) });
  }

  try {
    await insertOne("trainers", "trainer_id", {
      employee_no: employee.employeeNo,
      added_by_plant: req.user.plantCode,
      is_active: 1,
      created_at: raw("SYSTIMESTAMP"),
      updated_at: raw("SYSTIMESTAMP"),
    });
  } catch (error) {
    // Two HRs added the same person at the same moment.
    if (isDuplicateError(error)) {
      return res.status(409).json({ success: false, message: `${employee.fullName} is already a trainer.` });
    }
    throw error;
  }

  res.status(201).json({ success: true, data: publicEmployee(employee) });
});

export const removeTrainer = guarded(async (req, res) => {
  const employeeNo = String(req.params.employeeNo || "").trim().toUpperCase();
  const result = await runQuery(
    `UPDATE trainers SET is_active = 0, updated_at = SYSTIMESTAMP
      WHERE UPPER(employee_no) = :employeeNo AND is_active = 1`,
    { employeeNo }
  );
  if (!result.rowsAffected) {
    return res.status(404).json({ success: false, message: "Trainer not found." });
  }
  res.json({ success: true });
});

// One-time helper: turn everyone the employee system already flags as a trainer into TRAINERS rows.
export const importFlaggedTrainers = guarded(async (req, res) => {
  const [all, current] = await Promise.all([fetchAllEmployees(), runQuery(`SELECT employee_no, is_active FROM trainers`)]);
  const known = new Map(current.rows.map((r) => [String(r.EMPLOYEE_NO).toUpperCase(), Number(r.IS_ACTIVE)]));

  let added = 0;
  for (const e of all.filter((x) => x.isTrainer)) {
    const key = e.employeeNo.toUpperCase();
    if (known.has(key)) continue; // already there (active, or removed on purpose) — leave it alone
    try {
      await insertOne("trainers", "trainer_id", {
        employee_no: e.employeeNo,
        added_by_plant: req.user.plantCode,
        is_active: 1,
        created_at: raw("SYSTIMESTAMP"),
        updated_at: raw("SYSTIMESTAMP"),
      });
      added++;
    } catch (error) {
      if (!isDuplicateError(error)) throw error;
    }
  }
  res.json({ success: true, added });
});
