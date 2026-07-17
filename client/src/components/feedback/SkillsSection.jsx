function SkillsSection({ formData, handleChange }) {
  return (
    <table className="w-full border border-black border-collapse text-sm mt-4">
      <tbody>

        {/* Main Question */}
        <tr>
          <td className="border border-black w-10 text-center">
            3
          </td>

          <td className="border border-black p-2">
            <div className="flex justify-between items-center">

              <span className="font-semibold">
                Will you be able to use the skills learnt during the programme?
              </span>

              <div className="flex gap-8">

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="skills"
                    value="Yes"
                    className="w-4 h-4 accent-gray-700"
                    checked={formData.skills === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="skills"
                    value="No"
                    className="w-4 h-4 accent-gray-700"
                    checked={formData.skills === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>

              </div>

            </div>
          </td>
        </tr>

        {/* YES */}
        {formData.skills === "Yes" && (
          <tr>
            <td className="border border-black text-center">
              a
            </td>

            <td className="border border-black p-2">
              <p className="mb-2">
                How will you apply the skills learnt?
              </p>

              <textarea
                name="skillsYes"
                value={formData.skillsYes}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-gray-500 focus:border-gray-500 transition duration-200"
                placeholder="Describe how you will use the skills..."
              />
            </td>
          </tr>
        )}

        {/* NO */}
        {formData.skills === "No" && (
          <tr>
            <td className="border border-black text-center">
              b
            </td>

            <td className="border border-black p-2">
              <p className="mb-2">
                Please specify why you will not be able to use the skills.
              </p>

              <textarea
                name="skillsNo"
                value={formData.skillsNo}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-gray-500 focus:border-gray-500 transition duration-200"
                placeholder="Enter your reason..."
              />
            </td>
          </tr>
        )}

      </tbody>
    </table>
  );
}

export default SkillsSection;