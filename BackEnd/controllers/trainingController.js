import { runQuery, withTransaction, withIdRetry, insertRow, getNextId, raw } from "../utils/db.js";
import { fetchEmployeeByNo, fetchEmployeesByPlant, fetchAllEmployees } from "../services/employeeApiService.js";

// Trainer employee numbers -> names, for display only. If the employee API is
// slow or down the pages still load and simply show the employee number.
async function trainerNames(employeeNos) {
  const names = {};
  await Promise.all(
    [...new Set(employeeNos.filter(Boolean))].map(async (no) => {
      try {
        const e = await fetchEmployeeByNo(no);
        if (e?.fullName) names[no] = e.fullName;
      } catch {
        /* show the number instead */
      }
    })
  );
  return names;
}

// For the "pick employees to assign" checklist.
//   (default)       this admin's own plant
//   ?scope=others   every OTHER plant (the "Add other plant employees" button)
export const listAssignableEmployees = async (req, res) => {
  const plantCode = req.user.plantCode;
  const pick = (e) => ({
    employeeNo: e.employeeNo,
    fullName: e.fullName,
    department: e.department,
    plantCode: e.plantCode,
  });

  if (req.query.scope === "others") {
    const all = await fetchAllEmployees();
    return res.json({ success: true, data: all.filter((e) => e.plantCode !== plantCode).map(pick) });
  }

  const employees = await fetchEmployeesByPlant(plantCode);
  res.json({ success: true, data: employees.map(pick) });
};

// Trainers for the "Trainer" dropdown: the shared list HR manages, covering ALL plants.
export const listTrainerOptions = async (req, res) => {
  const result = await runQuery(
    `SELECT employee_no FROM trainers WHERE is_active = 1 ORDER BY employee_no`
  );
  const people = await Promise.all(
    result.rows.map(async (r) => {
      try {
        return await fetchEmployeeByNo(r.EMPLOYEE_NO);
      } catch {
        return null;
      }
    })
  );
  const data = people
    .filter(Boolean)
    .map((e) => ({ employeeNo: e.employeeNo, fullName: e.fullName, department: e.department, plantCode: e.plantCode }))
    .sort((a, b) => a.fullName.localeCompare(b.fullName));
  res.json({ success: true, data });
};

// Dashboard: every training for this plant + a live pending/completed count.
export const listTrainings = async (req, res) => {
  const plantCode = req.user.plantCode;

  const result = await runQuery(
    `SELECT t.training_id, tt.training_name, t.trainer_employee_no, t.created_at,
            SUM(CASE WHEN f.status = 'PENDING' THEN 1 ELSE 0 END) AS pending_count,
            SUM(CASE WHEN f.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_count
     FROM trainings t
     JOIN training_types tt ON tt.training_type_id = t.training_type_id
     LEFT JOIN training_feedback f ON f.training_id = t.training_id
     WHERE t.plant_code = :plantCode
     GROUP BY t.training_id, tt.training_name, t.trainer_employee_no, t.created_at
     ORDER BY t.created_at DESC`,
    { plantCode }
  );

  const names = await trainerNames(result.rows.map((r) => r.TRAINER_EMPLOYEE_NO));
  const data = result.rows.map((r) => ({ ...r, TRAINER_NAME: names[r.TRAINER_EMPLOYEE_NO] || null }));

  res.json({ success: true, data });
};

// One training's assigned employees + their status (admin drill-down view).
export const getTrainingDetail = async (req, res) => {
  const { id } = req.params;

  // An admin may only open trainings that belong to their own plant.
  const owned = await runQuery(
    `SELECT t.training_id, tt.training_name, t.trainer_employee_no, t.created_at
       FROM trainings t
       JOIN training_types tt ON tt.training_type_id = t.training_type_id
      WHERE t.training_id = :id AND t.plant_code = :plantCode`,
    { id, plantCode: req.user.plantCode }
  );
  if (owned.rows.length === 0) {
    return res.status(404).json({ success: false, message: "Training not found." });
  }

  const result = await runQuery(
    `SELECT record_id, employee_no, participant_name, department, status, submitted_at
     FROM training_feedback WHERE training_id = :id ORDER BY participant_name`,
    { id }
  );

  const training = owned.rows[0];
  const names = await trainerNames([training.TRAINER_EMPLOYEE_NO]);

  // `data` is still the plain list of employees (unchanged); `training` is new header info.
  res.json({
    success: true,
    data: result.rows,
    training: { ...training, TRAINER_NAME: names[training.TRAINER_EMPLOYEE_NO] || null },
  });
};

// Create a session + bulk-assign in one all-or-nothing call.
export const createTraining = async (req, res) => {
  const { trainingTypeId, trainerEmployeeNo, employeeNos, includeOtherPlants } = req.body;
  const plantCode = req.user.plantCode;

  if (!trainingTypeId || !trainerEmployeeNo || !Array.isArray(employeeNos) || employeeNos.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Training type, trainer, and at least one employee are required.",
    });
  }

  // The trainer must be on the shared trainer list (any plant) and be a real employee.
  const trainerRow = await runQuery(
    `SELECT employee_no FROM trainers WHERE UPPER(employee_no) = :no AND is_active = 1`,
    { no: String(trainerEmployeeNo).trim().toUpperCase() }
  );
  const trainer = trainerRow.rows.length ? await fetchEmployeeByNo(trainerEmployeeNo) : null;
  if (!trainer) {
    return res.status(404).json({ success: false, message: "That person is not on the trainer list." });
  }

  const typeResult = await runQuery(
    `SELECT training_name FROM training_types WHERE training_type_id = :trainingTypeId AND is_active = 1`,
    { trainingTypeId }
  );
  if (typeResult.rows.length === 0) {
    return res.status(404).json({ success: false, message: "Training type not found." });
  }
  const courseName = typeResult.rows[0].TRAINING_NAME;

  // Look up every employee BEFORE writing anything. De-duplicate, and the
  // trainer never gets a feedback form for their own session.
  const wanted = [...new Set(employeeNos.map((n) => String(n).trim()))].filter(
    (n) => n && n !== trainerEmployeeNo
  );
  const looked = await Promise.all(wanted.map((n) => fetchEmployeeByNo(n)));
  // Own plant only, unless HR switched on "Add other plant employees".
  const isMine = (e) => e && (includeOtherPlants === true || e.plantCode === plantCode);
  const employees = looked.filter(isMine);
  const notFound = wanted.filter((_, i) => !isMine(looked[i]));

  if (employees.length === 0) {
    return res.status(400).json({ success: false, message: "None of the selected employees could be found." });
  }

  // One transaction: the training and ALL its assignments are saved together,
  // or none of them are. IDs are picked in code (MAX + 1); if another request
  // grabs the same ID first, withIdRetry() re-runs the whole thing.
  const trainingId = await withIdRetry(() =>
    withTransaction(async (exec) => {
      const newId = await insertRow(exec, "trainings", "training_id", {
        training_type_id: trainingTypeId,
        trainer_employee_no: trainerEmployeeNo,
        plant_code: plantCode,
        created_at: raw("SYSTIMESTAMP"),
      });

      let recordId = await getNextId(exec, "training_feedback", "record_id");
      for (const employee of employees) {
        await insertRow(
          exec,
          "training_feedback",
          "record_id",
          {
            training_id: newId,
            employee_no: employee.employeeNo,
            participant_name: employee.fullName,
            department: employee.department,
            course_name: courseName,
            status: "PENDING",
            assigned_at: raw("SYSTIMESTAMP"),
          },
          recordId++
        );
      }
      return newId;
    })
  );

  res.status(201).json({
    success: true,
    data: { trainingId, assigned: employees.length, notFound },
  });
};
