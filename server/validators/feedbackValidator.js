import DEPARTMENTS from "../constants/departments.js";

const RATING_VALUES = [
  "Excellent",
  "Very Good",
  "Good",
  "Acceptable",
  "Poor",
];

// ==============================
// Helper Functions
// ==============================

// Must contain at least one letter or number
const isValidText = (value) => {
  if (!value || typeof value !== "string") return false;

  const text = value.trim();

  if (!text) return false;

  return /[A-Za-z0-9]/.test(text);
};

// Employee Number
const isValidEmployeeNumber = (value) => {
  if (!value || typeof value !== "string") return false;

  return /^\d+$/.test(value.trim());
};

// Rating
const isValidRating = (value) => {
  return RATING_VALUES.includes(String(value));
};

// ==============================
// Main Validator
// ==============================

const validateFeedback = (data) => {
  // Participant Name
  if (!isValidText(data.participantName)) {
    return {
      valid: false,
      message: "Invalid Participant Name.",
    };
  }

  // Employee Number
  if (!isValidEmployeeNumber(data.employeeNo)) {
    return {
      valid: false,
      message: "Employee Number must contain only digits.",
    };
  }

  // Department
  if (!DEPARTMENTS.includes(data.department)) {
    return {
      valid: false,
      message: "Invalid Department selected.",
    };
  }

  // Date
  if (!data.date) {
    return {
      valid: false,
      message: "Date is required.",
    };
  }

  // Course
  if (!isValidText(data.course)) {
    return {
      valid: false,
      message: "Invalid Course / Programme.",
    };
  }

  // Ratings
  const ratings = [
    { key: "content", label: "Content" },
    { key: "presentation", label: "Presentation" },
    { key: "style", label: "Style" },
    { key: "material", label: "Material" },
    { key: "venue", label: "Venue" },
    { key: "others", label: "Others" },
  ];

  for (const rating of ratings) {
    if (!isValidRating(data[rating.key])) {
      return {
        valid: false,
        message: `${rating.label} rating is invalid.`,
      };
    }
  }

  // Expectation
  if (!["Yes", "No"].includes(data.expectation)) {
    return {
      valid: false,
      message: "Invalid Expectation value.",
    };
  }

  if (
    data.expectation === "Yes" &&
    !isValidText(data.expectationYes)
  ) {
    return {
      valid: false,
      message: "Please enter the Major Areas of Learning.",
    };
  }

  if (
    data.expectation === "No" &&
    !isValidText(data.expectationNo)
  ) {
    return {
      valid: false,
      message: "Please enter the Reason for Expectations Not Met.",
    };
  }

  // Skills
  if (!isValidText(data.skills)) {
    return {
      valid: false,
      message: "Invalid Skills field.",
    };
  }

  // Suggestions
  if (!isValidText(data.suggestions)) {
    return {
      valid: false,
      message: "Invalid Suggestions field.",
    };
  }

  // ==============================
  // Sanitized Data
  // ==============================

  return {
    valid: true,

    data: {
      ...data,

      participantName: data.participantName.trim(),
      employeeNo: data.employeeNo.trim(),
      department: data.department.trim(),
      course: data.course.trim(),

      expectationYes: data.expectationYes?.trim() || "",
      expectationNo: data.expectationNo?.trim() || "",

      skills: data.skills.trim(),
      suggestions: data.suggestions.trim(),
    },
  };
};

export default validateFeedback;