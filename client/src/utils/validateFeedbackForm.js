export default function validateFeedbackForm(formData) {
  const missingFields = [];

  // ======================
  // Validation Helpers
  // ======================

  // Text validation
  // Must contain at least one letter or number
  const isValidText = (value) => {
    if (!value?.trim()) return false;

    return /[A-Za-z0-9]/.test(value);
  };

  // Employee Number
  // Digits only
  const isValidEmployeeNumber = (value) => {
    if (!value?.trim()) return false;

    return /^\d+$/.test(value);
  };

  // ======================
  // Basic Details
  // ======================

  if (!isValidText(formData.participantName)) {
    missingFields.push("Participant Name");
  }

  if (!isValidEmployeeNumber(formData.employeeNo)) {
    missingFields.push("Employee Number");
  }

  if (!formData.department) {
    missingFields.push("Department");
  }

  if (!formData.date) {
    missingFields.push("Date");
  }

  if (!isValidText(formData.course)) {
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
  } else if (
    formData.expectation === "Yes" &&
    !isValidText(formData.expectationYes)
  ) {
    missingFields.push("Major Areas of Learning");
  } else if (
    formData.expectation === "No" &&
    !isValidText(formData.expectationNo)
  ) {
    missingFields.push("Reason for Expectations Not Met");
  }

  // ======================
  // Skills
  // ======================

  if (!isValidText(formData.skills)) {
    missingFields.push("Skills");
  }

  // ======================
  // Suggestions
  // ======================

  if (!isValidText(formData.suggestions)) {
    missingFields.push("Suggestions");
  }

  return missingFields;
}