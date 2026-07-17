import { useState } from "react";

export default function useFeedbackForm() {
  const [formData, setFormData] = useState({
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

    expectation: "",
    expectationYes: "",
    expectationNo: "",

    skills: "",
    skillsYes: "",
    skillsNo: "",

    suggestions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    console.log(name, value)
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    formData,
    setFormData,
    handleChange,
  };
}