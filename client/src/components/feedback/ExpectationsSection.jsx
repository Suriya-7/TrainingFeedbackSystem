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



  const handleExpectationChange = (e) => {

    const { value } = e.target;

    handleChange(e);



    if (value === "Yes") {

      handleChange({
        target: {
          name: "expectationNo",
          value: "",
        },
      });


      setErrors((prev) => ({
        ...prev,
        expectation: "",
        expectationNo: "",
      }));

    }



    if (value === "No") {

      handleChange({
        target: {
          name: "expectationYes",
          value: "",
        },
      });


      setErrors((prev) => ({
        ...prev,
        expectation: "",
        expectationYes: "",
      }));

    }

  };



  const textareaClass = (field) =>
    `
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
      errors?.[field]
        ? "border-2 border-red-500 focus:ring-red-300"
        : "border border-gray-300 focus:ring-gray-400"
    }
    `;



  return (

    <div
      className="
      bg-white
      rounded-xl
      shadow-md
      border
      border-gray-200
      p-4
      md:p-6
      mt-4
      "
    >


      {/* Question Section */}

      <div
        className={`
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-4
        pb-4
        ${
          errors?.expectation
            ? "border-b border-red-500"
            : "border-b border-gray-200"
        }
        `}
      >


        <h3
          className="
          text-lg
          font-bold
          text-gray-800
          "
        >
          Were your expectations met?
        </h3>



        <div
          className="
          flex
          gap-6
          "
        >


          <label
            className="
            flex
            items-center
            gap-2
            cursor-pointer
            text-sm
            text-gray-700
            "
          >

            <input

              type="radio"

              name="expectation"

              value="Yes"

              checked={
                formData.expectation === "Yes"
              }

              onChange={handleExpectationChange}

              className="
              w-4
              h-4
              accent-gray-700
              cursor-pointer
              "

            />

            Yes

          </label>



          <label
            className="
            flex
            items-center
            gap-2
            cursor-pointer
            text-sm
            text-gray-700
            "
          >

            <input

              type="radio"

              name="expectation"

              value="No"

              checked={
                formData.expectation === "No"
              }

              onChange={handleExpectationChange}

              className="
              w-4
              h-4
              accent-gray-700
              cursor-pointer
              "

            />

            No

          </label>


        </div>


      </div>



      {
        errors?.expectation && (

          <p
            className="
            text-red-500
            text-xs
            mt-2
            "
          >
            {errors.expectation}
          </p>

        )
      }





      {/* Yes Response */}

      {
        formData.expectation === "Yes" && (

          <div
            className="
            mt-4
            "
          >

            <label
              className="
              block
              text-sm
              font-semibold
              text-gray-700
              mb-2
              "
            >
              Please list major areas of your learning:
            </label>



            <textarea

              name="expectationYes"

              value={
                formData.expectationYes || ""
              }

              onChange={handleInputChange}

              rows="4"

              placeholder="Enter your learning..."

              className={
                textareaClass("expectationYes")
              }

            />



            {
              errors?.expectationYes && (

                <p
                  className="
                  text-red-500
                  text-xs
                  mt-1
                  "
                >
                  {errors.expectationYes}
                </p>

              )
            }


          </div>

        )
      }






      {/* No Response */}

      {
        formData.expectation === "No" && (

          <div
            className="
            mt-4
            "
          >

            <label
              className="
              block
              text-sm
              font-semibold
              text-gray-700
              mb-2
              "
            >
              Please give reasons:
            </label>



            <textarea

              name="expectationNo"

              value={
                formData.expectationNo || ""
              }

              onChange={handleInputChange}

              rows="4"

              placeholder="Enter the reason..."

              className={
                textareaClass("expectationNo")
              }

            />



            {
              errors?.expectationNo && (

                <p
                  className="
                  text-red-500
                  text-xs
                  mt-1
                  "
                >
                  {errors.expectationNo}
                </p>

              )
            }


          </div>

        )
      }



    </div>

  );

}


export default ExpectationsSection;