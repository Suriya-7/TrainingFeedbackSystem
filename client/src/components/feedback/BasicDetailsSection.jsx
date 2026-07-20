function BasicDetailsSection({
  formData,
  handleChange,
  errors,
  setErrors,
}) {
  // Handle input change and clear error for that field
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
    <table className="mt-6 w-full border border-black border-collapse text-sm">
      <tbody>

        {/* Row 1 */}
        <tr>
          <td className="border border-black p-3 w-2/3">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <label className="font-semibold whitespace-nowrap min-w-[150px]">
                  Participant's Name:
                </label>

                <input
                  type="text"
                  name="participantName"
                  value={formData.participantName}
                  onChange={handleInputChange}
                  placeholder="Enter Your Name"
                  className={`flex-1 px-3 py-2 rounded-md transition duration-200 focus:outline-none
                    ${
                      errors?.participantName
                        ? "border-2 border-red-500"
                        : "border border-gray-500 focus:ring-1 focus:ring-gray-500"
                    }`}
                />
              </div>

              {errors?.participantName && (
                <p className="text-red-500 text-xs mt-1 ml-[165px]">
                  {errors.participantName}
                </p>
              )}
            </div>
          </td>

          <td className="border border-black p-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <label className="font-semibold whitespace-nowrap">
                  Emp. No:
                </label>

                <input
                  type="text"
                  name="employeeNo"
                  value={formData.employeeNo}
                  onChange={handleInputChange}
                  placeholder="Employee ID"
                  className={`flex-1 px-3 py-2 rounded-md transition duration-200 focus:outline-none
                    ${
                      errors?.employeeNo
                        ? "border-2 border-red-500"
                        : "border border-gray-500 focus:ring-1 focus:ring-gray-500"
                    }`}
                />
              </div>

              {errors?.employeeNo && (
                <p className="text-red-500 text-xs mt-1 ml-[85px]">
                  {errors.employeeNo}
                </p>
              )}
            </div>
          </td>
        </tr>

        {/* Row 2 */}
        <tr>
          <td className="border border-black p-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <label className="font-semibold whitespace-nowrap min-w-[150px]">
                  Department:
                </label>

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  placeholder="Department"
                  className={`flex-1 px-3 py-2 rounded-md transition duration-200 focus:outline-none
                    ${
                      errors?.department
                        ? "border-2 border-red-500"
                        : "border border-gray-500 focus:ring-1 focus:ring-gray-500"
                    }`}
                />
              </div>

              {errors?.department && (
                <p className="text-red-500 text-xs mt-1 ml-[165px]">
                  {errors.department}
                </p>
              )}
            </div>
          </td>

          <td className="border border-black p-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <label className="font-semibold whitespace-nowrap">
                  Date:
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`flex-1 px-3 py-2 rounded-md transition duration-200 focus:outline-none
                    ${
                      errors?.date
                        ? "border-2 border-red-500"
                        : "border border-gray-500 focus:ring-1 focus:ring-gray-500"
                    }`}
                />
              </div>

              {errors?.date && (
                <p className="text-red-500 text-xs mt-1 ml-[55px]">
                  {errors.date}
                </p>
              )}
            </div>
          </td>
        </tr>

        {/* Row 3 */}
        <tr>
          <td colSpan="2" className="border border-black p-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <label className="font-semibold whitespace-nowrap min-w-[150px]">
                  Course / Programme:
                </label>

                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="Enter course/programme"
                  className={`flex-1 px-3 py-2 rounded-md transition duration-200 focus:outline-none
                    ${
                      errors?.course
                        ? "border-2 border-red-500"
                        : "border border-gray-500 focus:ring-1 focus:ring-gray-500"
                    }`}
                />
              </div>

              {errors?.course && (
                <p className="text-red-500 text-xs mt-1 ml-[165px]">
                  {errors.course}
                </p>
              )}
            </div>
          </td>
        </tr>

      </tbody>
    </table>
  );
}

export default BasicDetailsSection;