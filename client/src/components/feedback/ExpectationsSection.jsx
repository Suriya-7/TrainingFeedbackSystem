function ExpectationsSection({
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

    <table className="w-full border border-black border-collapse text-sm mt-4">

      <tbody>


        {/* Main Question */}

        <tr>

          <td className="border border-black p-2 w-10 text-center">
            2
          </td>


          <td className="border border-black p-2">


            <div className="flex justify-between items-center">


              <span className="font-semibold">
                Were your expectations met?
              </span>



              <div className="flex gap-8">


                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="radio"
                    name="expectation"
                    value="Yes"
                    checked={formData.expectation === "Yes"}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-gray-700"
                  />

                  Yes

                </label>



                <label className="flex items-center gap-2 cursor-pointer">

                  <input
                    type="radio"
                    name="expectation"
                    value="No"
                    checked={formData.expectation === "No"}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-gray-700"
                  />

                  No

                </label>


              </div>


            </div>



            {errors?.expectation && (

              <p className="text-red-500 text-xs mt-2">
                {errors.expectation}
              </p>

            )}


          </td>


        </tr>



        {/* YES Section */}

        {formData.expectation === "Yes" && (

          <tr>

            <td className="border border-black text-center">
              a
            </td>


            <td className="border border-black p-2">


              <p className="mb-2">
                Please list major areas of your learning:
              </p>



              <textarea

                name="expectationYes"

                value={formData.expectationYes || ""}

                onChange={handleInputChange}

                rows="3"

                placeholder="Enter your learning..."

                className={`w-full px-3 py-2 rounded-md focus:outline-none ${
                  
                  errors?.expectationYes

                  ? "border-2 border-red-500"

                  : "border border-gray-500"

                }`}

              />



              {errors?.expectationYes && (

                <p className="text-red-500 text-xs mt-1">

                  {errors.expectationYes}

                </p>

              )}


            </td>

          </tr>

        )}





        {/* NO Section */}

        {formData.expectation === "No" && (

          <tr>

            <td className="border border-black text-center">
              b
            </td>


            <td className="border border-black p-2">


              <p className="mb-2">
                Please give reasons:
              </p>



              <textarea

                name="expectationNo"

                value={formData.expectationNo || ""}

                onChange={handleInputChange}

                rows="3"

                placeholder="Enter the reason..."

                className={`w-full px-3 py-2 rounded-md focus:outline-none ${
                  
                  errors?.expectationNo

                  ? "border-2 border-red-500"

                  : "border border-gray-500"

                }`}

              />



              {errors?.expectationNo && (

                <p className="text-red-500 text-xs mt-1">

                  {errors.expectationNo}

                </p>

              )}


            </td>


          </tr>

        )}



      </tbody>


    </table>

  );

}


export default ExpectationsSection;