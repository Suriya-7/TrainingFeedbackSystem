export default function validateFeedbackForm(formData) {
  const missingFields = [];

  // Basic Details
  if (!formData.participantName.trim())
    missingFields.push("Participant's Name");

  if (!formData.employeeNo.trim())
    missingFields.push("Employee Number");

  if (!formData.department.trim())
    missingFields.push("Department");

  if (!formData.date)
    missingFields.push("Date");

  if (!formData.course.trim())
    missingFields.push("Course / Programme");

  // Ratings
  if (!formData.content)
    missingFields.push("Content Rating");

  if (!formData.presentation)
    missingFields.push("Presentation Rating");

  if (!formData.style)
    missingFields.push("Style Rating");

  if (!formData.material)
    missingFields.push("Material / Handouts Rating");

  if (!formData.venue)
    missingFields.push("Venue / Environment Rating");

  if (!formData.others)
    missingFields.push("Others Rating");

  // Expectations
  if (!formData.expectation) {
    missingFields.push("Expectations (Yes / No)");
  } else if (
    formData.expectation === "Yes" &&
    !formData.expectationYes.trim()
  ) {
    missingFields.push("Major Areas of Learning");
  } else if (
    formData.expectation === "No" &&
    !formData.expectationNo.trim()
  ) {
    missingFields.push("Reason for Expectations Not Met");
  }

  // Skills
  if (!formData.skills) {
    missingFields.push("Skills (Yes / No)");
  } else if (
    formData.skills === "Yes" &&
    !formData.skillsYes.trim()
  ) {
    missingFields.push("How Skills Will Be Applied");
  } else if (
    formData.skills === "No" &&
    !formData.skillsNo.trim()
  ) {
    missingFields.push("Reason Skills Cannot Be Applied");
  }

  // Suggestions
  if (!formData.suggestions.trim())
    missingFields.push("Suggestions");

  return missingFields;
}