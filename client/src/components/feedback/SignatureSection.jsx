function SignatureSection({
  formData,
  onSave,
  isSubmitting
}) {

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



      <div
        className="
        flex
        flex-col
        md:flex-row
        md:items-end
        md:justify-between
        gap-6
        "
      >



        {/* Signature Section */}

        <div
          className="
          w-full
          md:w-auto
          "
        >

          <p
            className="
            font-semibold
            text-sm
            text-gray-800
            mb-2
            "
          >
            Participant's Signature
          </p>



          <div
            className="
            w-full
            md:w-56
            mt-8
            border-b
            border-gray-400
            text-center
            italic
            text-gray-700
            pb-2
            "
          >

            {
              formData.participantName || ""
            }

          </div>


        </div>





        {/* Save Button */}

        <div
          className="
          w-full
          md:w-auto
          "
        >

          <button
            type="button"
            onClick={onSave}
            disabled={isSubmitting}
            className={`
              w-full
              md:w-auto
              px-8
              py-3
              text-white
              font-semibold
              rounded-lg
              shadow-md
              transition
              duration-200
              ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-800 cursor-pointer"
              }
            `}
          >


            {
              isSubmitting ? (

                <div
                  className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  "
                >


                  {/* Loading Spinner */}

                  <svg
                    className="
                    animate-spin
                    h-5
                    w-5
                    text-white
                    "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >

                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />


                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />

                  </svg>



                  <span>
                    Submitting...
                  </span>


                </div>


              ) : (

                "Save Feedback"

              )
            }


          </button>


        </div>



      </div>


    </div>

  );

}


export default SignatureSection;