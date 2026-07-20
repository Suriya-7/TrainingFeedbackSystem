export default function validateFeedbackForm(formData) {

  const missingFields = [];


  // ======================
  // Basic Details
  // ======================

  if (!formData.participantName?.trim()) {
    missingFields.push("Participant Name");
  }


  if (!formData.employeeNo?.trim()) {
    missingFields.push("Employee Number");
  }


  if (!formData.department?.trim()) {
    missingFields.push("Department");
  }


  if (!formData.date) {
    missingFields.push("Date");
  }


  if (!formData.course?.trim()) {
    missingFields.push("Course");
  }



  // ======================
  // Ratings
  // ======================

  if (!formData.content) {
    missingFields.push("Content");
  }


  if (!formData.presentation) {
    missingFields.push("Presentation");
  }


  if (!formData.style) {
    missingFields.push("Style");
  }


  if (!formData.material) {
    missingFields.push("Material");
  }


  if (!formData.venue) {
    missingFields.push("Venue");
  }


  if (!formData.others) {
    missingFields.push("Others");
  }



  // ======================
  // Expectations
  // ======================

  if (!formData.expectation) {

    missingFields.push("Expectation");

  } 
  else if (
    formData.expectation === "Yes" &&
    !formData.expectationYes?.trim()
  ) {

    missingFields.push("Major Areas of Learning");

  } 
  else if (
    formData.expectation === "No" &&
    !formData.expectationNo?.trim()
  ) {

    missingFields.push("Reason for Expectations Not Met");

  }



  // ======================
  // Skills
  // ======================

  if (!formData.skills) {

    missingFields.push("Skills");

  }
  else if (
    formData.skills === "Yes" &&
    !formData.skillsYes?.trim()
  ) {

    missingFields.push("How Skills Will Be Applied");

  }
  else if (
    formData.skills === "No" &&
    !formData.skillsNo?.trim()
  ) {

    missingFields.push("Reason Skills Cannot Be Applied");

  }



  // ======================
  // Suggestions
  // ======================

  if (!formData.suggestions?.trim()) {
    missingFields.push("Suggestions");
  }


  return missingFields;

}