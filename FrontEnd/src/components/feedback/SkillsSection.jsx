function SkillsSection({
  formData,
  handleChange,
  errors,
  setErrors,
}) {

  const handleInputChange = (e) => {
    handleChange(e);

    const { name } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const textareaClass = `
    w-full
    px-3
    py-2
    rounded-lg
    resize-none
    text-sm
    focus:outline-none
    focus:ring-2
    transition
    ${
      errors?.skills
        ? "border-2 border-red-500 focus:ring-red-300"
        : "border border-gray-300 focus:ring-gray-400"
    }
  `;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-5 mt-3">

      <h3 className="text-base font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">
        Will you be able to use the skills learnt during the programme?
      </h3>

      <textarea
        name="skills"
        value={formData.skills || ""}
        onChange={handleInputChange}
        rows="3"
        placeholder="Describe how you will apply the skills learnt..."
        className={textareaClass}
      />

      {errors?.skills && (
        <p className="text-red-500 text-xs mt-1">{errors.skills}</p>
      )}

    </div>
  );
}

export default SkillsSection;
