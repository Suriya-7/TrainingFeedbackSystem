function BasicDetailsSection({ formData, handleChange }) {
  return (
    <table className="mt-6 w-full border border-black border-collapse text-sm">
      <tbody>

        {/* Row 1 */}
        <tr>
          <td className="border border-black p-3 w-2/3">
            <div className="flex items-center gap-3">
              <label className="font-semibold whitespace-nowrap min-w-[150px]">
                Participant's Name:
              </label>

              <input
                type="text"
                name="participantName"
                value={formData.participantName}
                onChange={handleChange}
                placeholder="Enter Your Name"
                className="flex-1 px-3 py-2 border border-gray-500 rounded-md focus:ring-gray-500 focus:border-gray-500 transition duration-200"
              />
            </div>
          </td>

          <td className="border border-black p-3">
            <div className="flex items-center gap-3">
              <label className="font-semibold whitespace-nowrap">
                Emp. No:
              </label>

              <input
                type="text"
                name="employeeNo"
                value={formData.employeeNo}
                onChange={handleChange}
                placeholder="Employee ID"
                className="flex-1 px-3 py-2 border border-gray-500 rounded-md focus:ring-gray-500 focus:border-gray-500 transition duration-200"
              />
            </div>
          </td>
        </tr>

        {/* Row 2 */}
        <tr>
          <td className="border border-black p-3">
            <div className="flex items-center gap-3">
              <label className="font-semibold whitespace-nowrap min-w-[150px]">
                Department:
              </label>

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Department"
                className="flex-1 px-3 py-2 border border-gray-500 rounded-md focus:ring-gray-500 focus:border-gray-500 transition duration-200"
              />
            </div>
          </td>

          <td className="border border-black p-3">
            <div className="flex items-center gap-3">
              <label className="font-semibold whitespace-nowrap">
                Date:
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="flex-1 px-3 py-2 border border-gray-500 rounded-md focus:ring-gray-500 focus:border-gray-500 transition duration-200"
              />
            </div>
          </td>
        </tr>

        {/* Row 3 */}
        <tr>
          <td colSpan="2" className="border border-black p-3">
            <div className="flex items-center gap-3">
              <label className="font-semibold whitespace-nowrap min-w-[150px]">
                Course / Programme:
              </label>

              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="Enter course/programme"
                className="flex-1 px-3 py-2 border border-gray-500 rounded-md focus:ring-gray-500 focus:border-gray-500 transition duration-200"
              />
            </div>
          </td>
        </tr>

      </tbody>
    </table>
  );
}

export default BasicDetailsSection;