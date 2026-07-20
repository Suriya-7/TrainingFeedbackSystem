function SuggestionsSection({
  formData,
  handleChange,
  errors,
  setErrors,
}) {


  const handleInputChange = (e) => {

    const { name } = e.target;


    handleChange(e);


    if (errors[name]) {

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));

    }

  };


  return (
    <table className="w-full border border-black border-collapse text-sm mt-6">
      <tbody>

        <tr>

          <td className="border border-black w-10 text-center align-top p-3">
            4
          </td>


          <td className="border border-black p-4">

            <p className="font-semibold text-base mb-4">
              Suggestions for improving the programme:
            </p>


            <textarea

              name="suggestions"

              value={formData.suggestions || ""}

              onChange={handleInputChange}

              rows="6"

              placeholder="Share your valuable suggestions here..."

              className={`w-full px-3 py-2 rounded-md focus:outline-none transition duration-200 ${
                
                errors?.suggestions

                ? "border-2 border-red-500"

                : "border border-gray-500"

              }`}

            />


            {errors?.suggestions && (

              <p className="text-red-500 text-xs mt-1">

                {errors.suggestions}

              </p>

            )}


          </td>

        </tr>

      </tbody>
    </table>
  );
}


export default SuggestionsSection;