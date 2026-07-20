function RatingSection({
  formData,
  handleChange,
  errors,
  setErrors,
}) {


  const ratingItems = [

    { id: "a", label: "Content", name: "content" },

    { id: "b", label: "Presentation", name: "presentation" },

    { id: "c", label: "Style", name: "style" },

    {
      id: "d",
      label: "Material / Handouts / Visual Aid",
      name: "material",
    },

    {
      id: "e",
      label: "Venue / Environment",
      name: "venue",
    },

    {
      id: "f",
      label: "Others",
      name: "others",
    },

  ];


  const ratings = [
    "Poor",
    "Acceptable",
    "Excellent",
  ];



  const handleRatingChange = (e) => {

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
        border-b
        border-gray-200
        pb-3
        mb-5
        "
      >
        Comment on the following
      </h3>



      {/* ================= DESKTOP VIEW ================= */}

      <div className="hidden md:block">


        <div
          className="
          border
          border-gray-300
          rounded-lg
          overflow-hidden
          "
        >


          {/* Header */}

          <div
            className="
            grid
            grid-cols-4
            bg-gray-100
            border-b
            border-gray-300
            "
          >

            <div
              className="
              col-span-1
              p-3
              font-semibold
              text-gray-700
              "
            >
              Criteria
            </div>


            {
              ratings.map((rating) => (

                <div
                  key={rating}
                  className="
                  p-3
                  text-center
                  font-semibold
                  text-gray-700
                  border-l
                  border-gray-300
                  "
                >
                  {rating}
                </div>

              ))
            }


          </div>



          {/* Rating Rows */}

          {
            ratingItems.map((item) => (

              <div
                key={item.name}
                className={`
                grid
                grid-cols-4
                items-center
                border-b
                last:border-b-0
                ${
                  errors?.[item.name]
                  ? "bg-red-50"
                  : ""
                }
                `}
              >


                {/* Criteria Name */}

                <div
                  className={`
                  p-3
                  text-sm
                  font-medium
                  text-gray-800
                  border-r
                  border-gray-300
                  ${
                    errors?.[item.name]
                    ? "border-red-500"
                    : ""
                  }
                  `}
                >

                  <span className="italic mr-2">
                    {item.id}.
                  </span>

                  {item.label}


                  {
                    errors?.[item.name] && (

                      <p
                        className="
                        text-red-500
                        text-xs
                        mt-1
                        "
                      >
                        {errors[item.name]}
                      </p>

                    )
                  }

                </div>




                {/* Radio Buttons */}

                {
                  ratings.map((rating) => (

                    <div
                      key={rating}
                      className="
                      flex
                      justify-center
                      items-center
                      border-r
                      last:border-r-0
                      border-gray-300
                      h-full
                      "
                    >

                      <input

                        type="radio"

                        name={item.name}

                        value={rating}

                        checked={
                          formData[item.name] === rating
                        }

                        onChange={handleRatingChange}

                        className="
                        w-4
                        h-4
                        accent-gray-700
                        cursor-pointer
                        "

                      />

                    </div>

                  ))
                }


              </div>

            ))
          }


        </div>


      </div>





      {/* ================= MOBILE VIEW ================= */}


      <div
        className="
        block
        md:hidden
        space-y-4
        "
      >


        {
          ratingItems.map((item) => (

            <div
              key={item.name}
              className={`
              rounded-lg
              border
              p-4
              ${
                errors?.[item.name]
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
              }
              `}
            >


              <p
                className="
                font-medium
                text-gray-800
                mb-3
                "
              >

                <span className="italic mr-2">
                  {item.id}.
                </span>

                {item.label}

              </p>



              {
                errors?.[item.name] && (

                  <p
                    className="
                    text-red-500
                    text-xs
                    mb-2
                    "
                  >
                    {errors[item.name]}
                  </p>

                )
              }



              <div
                className="
                flex
                flex-col
                gap-3
                "
              >

                {
                  ratings.map((rating) => (

                    <label
                      key={rating}
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

                        name={item.name}

                        value={rating}

                        checked={
                          formData[item.name] === rating
                        }

                        onChange={handleRatingChange}

                        className="
                        w-4
                        h-4
                        accent-gray-700
                        cursor-pointer
                        "

                      />


                      {rating}


                    </label>

                  ))
                }


              </div>


            </div>

          ))
        }


      </div>


    </div>

  );

}


export default RatingSection;