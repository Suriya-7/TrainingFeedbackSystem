import { useState } from "react";

// Initial form values
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


  // Expectations
  expectation: "Yes",
  expectationYes: "",
  expectationNo: "",


  // Skills
  skills: "",
  skillsYes: "",
  skillsNo: "",


  suggestions: ""

};


export default function useFeedbackForm() {


  const [formData, setFormData] = useState(initialFormData);



  const handleChange = (e) => {

    const { name, value } = e.target;


    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));

  };



  // Reset the form after successful submission
  const resetForm = () => {

    setFormData(initialFormData);

  };



  return {

    formData,

    setFormData,

    handleChange,

    resetForm,

  };

}