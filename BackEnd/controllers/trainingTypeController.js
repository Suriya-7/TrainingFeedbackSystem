import { runQuery, insertOne, raw, isDuplicateError } from "../utils/db.js";

export const listTrainingTypes = async (req, res) => {
  const result = await runQuery(
    `SELECT training_type_id, training_name, is_active
     FROM training_types WHERE is_active = 1 ORDER BY training_name`
  );
  res.json({ success: true, data: result.rows });
};

export const createTrainingType = async (req, res) => {
  const { trainingName } = req.body;
  if (!trainingName?.trim()) {
    return res.status(400).json({ success: false, message: "Training name is required." });
  }

  try {
    const id = await insertOne("training_types", "training_type_id", {
      training_name: trainingName.trim(),
      is_active: 1,
      created_at: raw("SYSTIMESTAMP"),
      updated_at: raw("SYSTIMESTAMP"),
    });
    res.status(201).json({ success: true, data: id });
  } catch (error) {
    if (isDuplicateError(error)) {
      return res.status(409).json({ success: false, message: "That training name already exists." });
    }
    console.error("createTrainingType error:", error.message);
    res.status(500).json({ success: false, message: "Could not create training type." });
  }
};

export const renameTrainingType = async (req, res) => {
  const { id } = req.params;
  const { trainingName } = req.body;
  if (!trainingName?.trim()) {
    return res.status(400).json({ success: false, message: "Training name is required." });
  }

  try {
    await runQuery(
      `UPDATE training_types SET training_name = :trainingName, updated_at = SYSTIMESTAMP
       WHERE training_type_id = :id`,
      { trainingName: trainingName.trim(), id }
    );
    res.json({ success: true });
  } catch (error) {
    if (isDuplicateError(error)) {
      return res.status(409).json({ success: false, message: "That training name already exists." });
    }
    throw error;
  }
};

export const deleteTrainingType = async (req, res) => {
  const { id } = req.params;
  await runQuery(
    `UPDATE training_types SET is_active = 0, updated_at = SYSTIMESTAMP WHERE training_type_id = :id`,
    { id }
  );
  res.json({ success: true });
};
