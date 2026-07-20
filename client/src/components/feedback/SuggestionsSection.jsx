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
      errors?.suggestions
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



      {/* Question */}

      <h3
        className="
        text-lg
        font-bold
        text-gray-800
        border-b
        border-gray-200
        pb-3
        mb-4
        "
      >
        Suggestions for improving the programme:
      </h3>




      {/* Suggestions Input */}

      <textarea

        name="suggestions"

        value={
          formData.suggestions || ""
        }

        onChange={handleInputChange}

        rows="6"

        placeholder="Share your valuable suggestions here..."

        className={textareaClass}

      />



      {
        errors?.suggestions && (

          <p
            className="
            text-red-500
            text-xs
            mt-1
            "
          >
            {errors.suggestions}
          </p>

        )
      }



    </div>

  );

}


export default SuggestionsSection;