import { useState } from "react";

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

  suggestions: ""

};


export default function useFeedbackForm() {


  const [formData, setFormData] = useState({
    ...initialFormData
  });


  const handleChange = (e) => {

    const { name, value } = e.target;


    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));

  };


  const resetForm = () => {

    setFormData({
      ...initialFormData
    });

  };


  return {

    formData,

    setFormData,

    handleChange,

    resetForm,

  };

}