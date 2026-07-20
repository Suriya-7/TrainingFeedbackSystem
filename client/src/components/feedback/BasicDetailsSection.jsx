function BasicDetailsSection({
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


  const inputClass = (field) =>
    `w-full px-2 py-1 rounded-sm text-sm focus:outline-none ${
      errors?.[field]
        ? "border border-red-500"
        : "border border-gray-400 focus:ring-1 focus:ring-gray-400"
    }`;


  return (

    <table className="mt-3 w-full border border-black border-collapse text-sm">

      <tbody>

        <tr>

          <td className="border border-black p-2">

            <div className="flex items-center gap-2">

              <label className="font-semibold whitespace-nowrap w-36">
                Participant's Name:
              </label>

              <input
                type="text"
                name="participantName"
                value={formData.participantName}
                onChange={handleInputChange}
                placeholder="Enter Your Name"
                className={inputClass("participantName")}
              />

            </div>

            {errors?.participantName && (
              <p className="text-red-500 text-xs mt-0.5 ml-36">
                {errors.participantName}
              </p>
            )}

          </td>


          <td className="border border-black p-2">

            <div className="flex items-center gap-2">

              <label className="font-semibold whitespace-nowrap">
                Emp. No:
              </label>

              <input
                type="text"
                name="employeeNo"
                value={formData.employeeNo}
                onChange={handleInputChange}
                placeholder="Employee ID"
                className={inputClass("employeeNo")}
              />

            </div>

            {errors?.employeeNo && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.employeeNo}
              </p>
            )}

          </td>

        </tr>


        <tr>

          <td className="border border-black p-2">

            <div className="flex items-center gap-2">

              <label className="font-semibold whitespace-nowrap w-36">
                Department:
              </label>

              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Department"
                className={inputClass("department")}
              />

            </div>

            {errors?.department && (
              <p className="text-red-500 text-xs mt-0.5 ml-36">
                {errors.department}
              </p>
            )}

          </td>


          <td className="border border-black p-2">

            <div className="flex items-center gap-2">

              <label className="font-semibold whitespace-nowrap">
                Date:
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={inputClass("date")}
              />

            </div>

            {errors?.date && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.date}
              </p>
            )}

          </td>

        </tr>


        <tr>

          <td
            colSpan="2"
            className="border border-black p-2"
          >

            <div className="flex items-center gap-2">

              <label className="font-semibold whitespace-nowrap w-36">
                Course / Programme:
              </label>

              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                placeholder="Enter course/programme"
                className={inputClass("course")}
              />

            </div>

            {errors?.course && (
              <p className="text-red-500 text-xs mt-0.5 ml-36">
                {errors.course}
              </p>
            )}

          </td>

        </tr>

      </tbody>

    </table>

  );

}

export default BasicDetailsSection;