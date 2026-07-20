import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import api from "../../services/api";

import HeaderSection from "./HeaderSection";
import BasicDetailsSection from "./BasicDetailsSection";
import RatingSection from "./RatingSection";
import ExpectationsSection from "./ExpectationsSection";
import SkillsSection from "./SkillsSection";
import SuggestionsSection from "./SuggestionsSection";
import SignatureSection from "./SignatureSection";

import useFeedbackForm from "../../hooks/useFeedbackForm";
import validateFeedbackForm from "../../utils/validateFeedbackForm";

function FeedbackForm() {

  const {
    formData,
    handleChange,
    resetForm
  } = useFeedbackForm();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSave = async () => {

    if (isSubmitting) return;

    const missingFields = validateFeedbackForm(formData);

    const newErrors = {};

    missingFields.forEach((field) => {

      switch (field) {

        case "Participant Name":
          newErrors.participantName = "Participant Name is required";
          break;

        case "Employee Number":
          newErrors.employeeNo = "Employee Number is required";
          break;

        case "Department":
          newErrors.department = "Department is required";
          break;

        case "Date":
          newErrors.date = "Date is required";
          break;

        case "Course":
          newErrors.course = "Course is required";
          break;

        case "Content":
          newErrors.content = "Please rate Content";
          break;

        case "Presentation":
          newErrors.presentation = "Please rate Presentation";
          break;

        case "Style":
          newErrors.style = "Please rate Style";
          break;

        case "Material":
          newErrors.material = "Please rate Material";
          break;

        case "Venue":
          newErrors.venue = "Please rate Venue";
          break;

        case "Others":
          newErrors.others = "Please rate Others";
          break;

        case "Expectation":
          newErrors.expectation = "Please enter your expectation feedback";
          break;

        case "Skills":
          newErrors.skills = "Please enter how you will use the skills learned";
          break;

        case "Suggestions":
          newErrors.suggestions = "Suggestions are required";
          break;

        default:
          break;
      }

    });

    setErrors(newErrors);

    if (missingFields.length > 0) {

      toast.warning(
        `Please enter ${missingFields[0]}.`,
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        }
      );

      return;
    }

    const result = await Swal.fire({
      title: "Submit Feedback?",
      text: "Are you sure you want to submit this feedback?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#374151",
      cancelButtonColor: "#dc2626",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {

      setIsSubmitting(true);

      const response = await api.post(
        "/feedback",
        formData
      );

      console.log(response.data);

      toast.success(
        "Feedback submitted successfully!",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        }
      );

      resetForm();
      setErrors({});

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to submit feedback. Please try again.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        }
      );

    } finally {

      setIsSubmitting(false);

    }

  };

  return (

    <div className="bg-gray-200 min-h-screen py-6 sm:py-10 px-2">

      <div className="w-full max-w-[210mm] min-h-screen mx-auto bg-white shadow-lg p-4 sm:p-6">

        <HeaderSection />

        <BasicDetailsSection
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          setErrors={setErrors}
        />

        <RatingSection
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          setErrors={setErrors}
        />

        <ExpectationsSection
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          setErrors={setErrors}
        />

        <SkillsSection
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          setErrors={setErrors}
        />

        <SuggestionsSection
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          setErrors={setErrors}
        />

        <SignatureSection
          formData={formData}
          onSave={handleSave}
          isSubmitting={isSubmitting}
        />

      </div>

    </div>

  );

}

export default FeedbackForm;