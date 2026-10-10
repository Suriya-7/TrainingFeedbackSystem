import { runQuery } from "../utils/db.js";

const RATINGS = ["Excellent", "Very Good", "Good", "Acceptable", "Poor"];
const YES_NO = ["Yes", "No"];

// Employee's home page: every PENDING training feedback assigned to them.
export const listMyPendingFeedback = async (req, res) => {
  const employeeNo = req.user.id;

  const result = await runQuery(
    `SELECT f.record_id, f.course_name, f.assigned_at, t.training_id
     FROM training_feedback f
     JOIN trainings t ON t.training_id = f.training_id
     WHERE f.employee_no = :employeeNo AND f.status = 'PENDING'
     ORDER BY f.assigned_at DESC`,
    { employeeNo }
  );

  res.json({ success: true, data: result.rows });
};

// One pending form's detail, for pre-filling the header (name/dept/course).
export const getFeedbackRecord = async (req, res) => {
  const { id } = req.params;
  const employeeNo = req.user.id;

  const result = await runQuery(
    `SELECT record_id, participant_name, department, course_name, status
     FROM training_feedback WHERE record_id = :id AND employee_no = :employeeNo`,
    { id, employeeNo }
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ success: false, message: "Feedback record not found." });
  }

  res.json({ success: true, data: result.rows[0] });
};

// Submit — updates the existing PENDING row in place.
export const submitFeedback = async (req, res) => {
  const { id } = req.params;
  const employeeNo = req.user.id;
  const {
    contentRating,
    presentationRating,
    styleRating,
    materialRating,
    venueRating,
    othersRating,
    expectationMet,
    skillsApplication,
    suggestions,
  } = req.body;

  const ratings = [contentRating, presentationRating, styleRating, materialRating, venueRating, othersRating];
  if (ratings.some((r) => !RATINGS.includes(r))) {
    return res.status(400).json({ success: false, message: "All six ratings are required." });
  }
  if (!YES_NO.includes(expectationMet) || !YES_NO.includes(skillsApplication)) {
    return res.status(400).json({ success: false, message: "Expectation and skills answers must be Yes or No." });
  }

  const existing = await runQuery(
    `SELECT status FROM training_feedback WHERE record_id = :id AND employee_no = :employeeNo`,
    { id, employeeNo }
  );
  if (existing.rows.length === 0) {
    return res.status(404).json({ success: false, message: "Feedback record not found." });
  }
  if (existing.rows[0].STATUS === "COMPLETED") {
    return res.status(409).json({ success: false, message: "This feedback has already been submitted." });
  }

  const updated = await runQuery(
    `UPDATE training_feedback SET
       content_rating = :contentRating,
       presentation_rating = :presentationRating,
       style_rating = :styleRating,
       material_rating = :materialRating,
       venue_rating = :venueRating,
       others_rating = :othersRating,
       expectation_met = :expectationMet,
       skills_application = :skillsApplication,
       suggestions = :suggestions,
       status = 'COMPLETED',
       submitted_at = SYSTIMESTAMP
     WHERE record_id = :id AND employee_no = :employeeNo AND status = 'PENDING'`,
    {
      contentRating, presentationRating, styleRating, materialRating, venueRating, othersRating,
      expectationMet, skillsApplication, suggestions: suggestions || null,
      id, employeeNo,
    }
  );

  // 0 rows means someone (e.g. a double-click) submitted it a moment earlier.
  if (!updated.rowsAffected) {
    return res.status(409).json({ success: false, message: "This feedback has already been submitted." });
  }

  res.json({ success: true, message: "Feedback submitted." });
};
