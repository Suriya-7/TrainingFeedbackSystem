import archiver from "archiver";

import { runQuery } from "../utils/db.js";
import { renderFeedbackPdfs, describePdfError } from "../services/pdfService.js";

// File names must be safe on Windows/Mac/Linux and inside a zip.
const safeName = (value, fallback = "file") =>
  String(value ?? "").trim().replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "") || fallback;

const slug = (value) =>
  String(value ?? "").trim().replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "training";

const asId = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

// An admin may only download PDFs of their OWN plant's trainings.
// Returns the training (with its plant) or null.
async function findOwnTraining(trainingId, plantCode) {
  const result = await runQuery(
    `SELECT t.training_id, t.plant_code, tt.training_name
       FROM trainings t
       JOIN training_types tt ON tt.training_type_id = t.training_type_id
      WHERE t.training_id = :trainingId AND t.plant_code = :plantCode`,
    { trainingId, plantCode }
  );
  return result.rows[0] || null;
}

// One training -> zip of every COMPLETED employee's PDF, named by employee number.
export const downloadTrainingPdfs = async (req, res) => {
  const trainingId = asId(req.params.id);
  if (!trainingId) {
    return res.status(400).json({ success: false, message: "Invalid training id." });
  }

  const training = await findOwnTraining(trainingId, req.user.plantCode);
  if (!training) {
    return res.status(404).json({ success: false, message: "Training not found." });
  }

  const result = await runQuery(
    `SELECT * FROM training_feedback
      WHERE training_id = :trainingId AND status = 'COMPLETED'
      ORDER BY employee_no`,
    { trainingId }
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: "No completed feedback for this training yet." });
  }

  // Build every PDF first. If anything fails we can still send a clean JSON
  // error, because nothing has been streamed to the browser yet.
  let buffers;
  try {
    buffers = await renderFeedbackPdfs(result.rows, training.PLANT_CODE);
  } catch (error) {
    console.error("PDF generation failed:", error);
    return res.status(500).json({ success: false, message: describePdfError(error) });
  }

  const used = new Set();
  const files = result.rows.map((row, i) => {
    let base = safeName(row.EMPLOYEE_NO, `employee-${i + 1}`);
    while (used.has(base.toLowerCase())) base += "_2"; // same emp no twice (e.g. resubmission)
    used.add(base.toLowerCase());
    return { name: `${base}.pdf`, data: buffers[i] };
  });

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${slug(training.TRAINING_NAME)}-feedback.zip"`
  );

  const archive = archiver("zip", { zlib: { level: 6 } });
  archive.on("error", (err) => {
    console.error("ZIP error:", err.message);
    res.destroy(err);
  });
  archive.pipe(res);
  for (const f of files) archive.append(f.data, { name: f.name });
  await archive.finalize();
};

// One employee's completed form as a single PDF.
export const downloadFeedbackPdf = async (req, res) => {
  const trainingId = asId(req.params.id);
  const recordId = asId(req.params.recordId);
  if (!trainingId || !recordId) {
    return res.status(400).json({ success: false, message: "Invalid id." });
  }

  const training = await findOwnTraining(trainingId, req.user.plantCode);
  if (!training) {
    return res.status(404).json({ success: false, message: "Training not found." });
  }

  const result = await runQuery(
    `SELECT * FROM training_feedback
      WHERE record_id = :recordId AND training_id = :trainingId AND status = 'COMPLETED'`,
    { recordId, trainingId }
  );
  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: "This employee has not submitted feedback yet." });
  }

  let buffers;
  try {
    buffers = await renderFeedbackPdfs(result.rows, training.PLANT_CODE);
  } catch (error) {
    console.error("PDF generation failed:", error);
    return res.status(500).json({ success: false, message: describePdfError(error) });
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${safeName(result.rows[0].EMPLOYEE_NO, "feedback")}.pdf"`
  );
  res.send(buffers[0]);
};
