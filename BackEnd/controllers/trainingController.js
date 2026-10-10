import oracledb from "oracledb";
import { runQuery, withTransaction } from "../utils/db.js";
import { fetchEmployeeByNo, fetchEmployeesByPlant } from "../services/employeeApiService.js";

// For the "pick employees to assign" checklist.
export const listAssignableEmployees = async (req, res) => {
  const plantCode = req.user.plantCode;
  const employees = await fetchEmployeesByPlant(plantCode);
  res.json({ success: true, data: employees });
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

  res.json({ success: true, data: result.rows });
};

// One training's assigned employees + their status (admin drill-down view).
export const getTrainingDetail = async (req, res) => {
  const { id } = req.params;

  const result = await runQuery(
    `SELECT record_id, employee_no, participant_name, department, status, submitted_at
     FROM training_feedback WHERE training_id = :id ORDER BY participant_name`,
    { id }
  );

  res.json({ success: true, data: result.rows });
};

// Create a session + bulk-assign in one all-or-nothing call.
export const createTraining = async (req, res) => {
  const { trainingTypeId, trainerEmployeeNo, employeeNos } = req.body;
  const plantCode = req.user.plantCode;

  if (!trainingTypeId || !trainerEmployeeNo || !Array.isArray(employeeNos) || employeeNos.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Training type, trainer, and at least one employee are required.",
    });
  }

  // Validate the trainer is a real employee before creating anything.
  const trainer = await fetchEmployeeByNo(trainerEmployeeNo);
  if (!trainer) {
    return res.status(404).json({ success: false, message: "Trainer not found." });
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
  const employees = looked.filter(Boolean);
  const notFound = wanted.filter((_, i) => !looked[i]);

  if (employees.length === 0) {
    return res.status(400).json({ success: false, message: "None of the selected employees could be found." });
  }

  // One transaction: the training and ALL its assignments are saved together,
  // or none of them are.
  const trainingId = await withTransaction(async (exec) => {
    const created = await exec(
      `INSERT INTO trainings (training_type_id, trainer_employee_no, plant_code)
       VALUES (:trainingTypeId, :trainerEmployeeNo, :plantCode)
       RETURNING training_id INTO :id`,
      {
        trainingTypeId,
        trainerEmployeeNo,
        plantCode,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      }
    );
    const newId = created.outBinds.id[0];

    for (const employee of employees) {
      await exec(
        `INSERT INTO training_feedback
           (training_id, employee_no, participant_name, department, course_name)
         VALUES (:trainingId, :employeeNo, :fullName, :department, :courseName)`,
        {
          trainingId: newId,
          employeeNo: employee.employeeNo,
          fullName: employee.fullName,
          department: employee.department,
          courseName,
        }
      );
    }
    return newId;
  });

  res.status(201).json({
    success: true,
    data: { trainingId, assigned: employees.length, notFound },
  });
};
