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
  const { formData, handleChange } = useFeedbackForm();

const handleSave = () => {
  const missingFields = validateFeedbackForm(formData);

  if (missingFields.length > 0) {
    alert(
      "Please complete the following fields:\n\n• " +
      missingFields.join("\n• ")
    );
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to submit this feedback?"
  );

  if (!confirmed) return;

  console.log("Feedback Submitted:");
  console.log(formData);

  alert("Feedback submitted successfully!");
};
  return (
    
    <div className="bg-gray-200 min-h-screen py-10">

      <div className="w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg p-6">

        <HeaderSection />

        <BasicDetailsSection
          formData={formData}
          handleChange={handleChange}
/>

        <RatingSection
          formData={formData}
          handleChange={handleChange}
/>

        <ExpectationsSection
          formData={formData}
          handleChange={handleChange}
/>

        <SkillsSection
          formData={formData}
          handleChange={handleChange}
/>

        <SuggestionsSection
          formData={formData}
          handleChange={handleChange}
/>

        <SignatureSection
  formData={formData}
  onSave={handleSave}
/>


<pre className="mt-6 bg-gray-100 p-4 rounded text-xs overflow-auto">
  {JSON.stringify(formData, null, 2)}
</pre>
      </div>

    </div>
  );
}

export default FeedbackForm;