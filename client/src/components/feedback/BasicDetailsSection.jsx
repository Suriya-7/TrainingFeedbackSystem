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
    `
    w-full
    px-3
    py-2
    text-sm
    rounded-lg
    border
    focus:outline-none
    focus:ring-2
    transition
    ${
      errors?.[field]
        ? "border-red-500 focus:ring-red-300"
        : "border-gray-300 focus:ring-gray-400"
    }
    `;


  const fields = [

    {
      label: "Participant's Name",
      name: "participantName",
      type: "text",
      placeholder: "Enter Your Name",
    },

    {
      label: "Emp. No",
      name: "employeeNo",
      type: "text",
      placeholder: "Employee ID",
    },

    {
      label: "Department",
      name: "department",
      type: "text",
      placeholder: "Department",
    },

    {
      label: "Date",
      name: "date",
      type: "date",
    },

    {
      label: "Course / Programme",
      name: "course",
      type: "text",
      placeholder: "Enter course/programme",
      fullWidth: true,
    },

  ];



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


      {/* Section Title */}
      <h3
        className="
        text-lg
        font-bold
        text-gray-800
        mb-5
        border-b
        border-gray-200
        pb-2
        "
      >
        Employee Details
      </h3>



      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-4
        "
      >


        {
          fields.map((field) => (

            <div
              key={field.name}
              className={
                field.fullWidth
                  ? "md:col-span-2"
                  : ""
              }
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
                {field.label}
              </label>


              <input

                type={field.type}

                name={field.name}

                value={formData[field.name]}

                onChange={handleInputChange}

                placeholder={field.placeholder}

                className={
                  inputClass(field.name)
                }

              />


              {
                errors?.[field.name] && (

                  <p
                    className="
                    text-red-500
                    text-xs
                    mt-1
                    "
                  >
                    {errors[field.name]}
                  </p>

                )
              }


            </div>

          ))
        }


      </div>


    </div>

  );

}


export default BasicDetailsSection;