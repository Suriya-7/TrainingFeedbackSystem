import { useState } from "react";
import {
  allowOnlyLetters,
  allowOnlyNumbers,
  allowParagraph,
} from "../utils/inputValidation";

const initialFormData = {
  participantName: "",
  employeeNo: "",
  department: "",
  date: "",
  course: "",

  content: "",
  presentation: "",
  style: "",
  material: "",
  venue: "",
  others: "",

  expectation: "Yes",
  expectationYes: "",
  expectationNo: "",

  skills: "",

  suggestions: "",
};

// ==========================================
// Validation rules for each field
// ==========================================
const fieldRules = {
  participantName: allowOnlyLetters,
  employeeNo: allowOnlyNumbers,
  department: allowOnlyLetters,
  course: allowOnlyLetters,

  expectationYes: allowParagraph,
  expectationNo: allowParagraph,
  skills: allowParagraph,
  suggestions: allowParagraph,
};

export default function useFeedbackForm() {
  const [formData, setFormData] = useState({
    ...initialFormData,
  });

  const handleChange = (e) => {
    const { name } = e.target;

    let value = e.target.value;

    // Apply validation rule if available
    if (fieldRules[name]) {
      value = fieldRules[name](value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      ...initialFormData,
    });
  };

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
  };
}