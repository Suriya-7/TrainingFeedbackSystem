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

  return (
    <table className="w-full border border-black border-collapse text-sm mt-4">
      <tbody>

        {/* Question */}
        <tr>
          <td className="border border-black w-10 text-center">
            3
          </td>

          <td className="border border-black p-2">
            <p className="font-semibold mb-2">
              Will you be able to use the skills learnt during the programme?
            </p>

            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              rows="3"
              placeholder="Describe how you will apply the skills learnt..."
              className={`w-full px-3 py-2 rounded-md transition duration-200 focus:outline-none ${
                errors?.skills
                  ? "border-2 border-red-500"
                  : "border border-gray-500 focus:ring-1 focus:ring-gray-500"
              }`}
            />

            {errors?.skills && (
              <p className="text-red-500 text-xs mt-1">
                {errors.skills}
              </p>
            )}
          </td>
        </tr>

      </tbody>
    </table>
  );
}

export default SkillsSection;