import { X } from "lucide-react";


/* ===========================
   Reusable Info Box Component
=========================== */

function InfoBox({ label, value }) {

  return (

    <div
      className="
        bg-white
        border
        border-gray-200
        rounded-xl
        p-4
        shadow-sm
        hover:shadow-md
        transition
      "
    >

      <p
        className="
          text-[11px]
          uppercase
          tracking-wider
          font-semibold
          text-gray-500
          mb-2
        "
      >
        {label}
      </p>


      <p
        className="
          text-sm
          font-semibold
          text-gray-900
          break-words
        "
      >
        {value || "-"}
      </p>


    </div>

  );

}



/* ===========================
   Section Header Component
=========================== */

function SectionTitle({ children }) {

  return (

    <div
      className="
        flex
        items-center
        gap-3
        mb-4
      "
    >

      <div
        className="
          w-1
          h-6
          rounded-full
          bg-gray-900
        "
      />

      <h3
        className="
          text-base
          sm:text-lg
          font-bold
          text-gray-900
        "
      >
        {children}
      </h3>

    </div>

  );

}



/* ===========================
   Feedback Modal
=========================== */

function FeedbackModal({ feedback, onClose }) {

  if (!feedback) return null;


  return (

    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        backdrop-blur-sm
        px-3
        sm:px-5
      "
    >

      <div
        className="
          bg-white
          w-full
          max-w-5xl
          rounded-3xl
          shadow-2xl
          overflow-hidden
          max-h-[92vh]
        "
      >


        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            px-5
            sm:px-7
            py-5
            border-b
            border-gray-200
            bg-gray-50
          "
        >

          <div>

            <h2
              className="
                text-xl
                sm:text-2xl
                font-bold
                text-gray-900
              "
            >
              Feedback Details
            </h2>


            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              Complete training feedback information
            </p>


          </div>



          <button
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-xl
              flex
              items-center
              justify-center
              text-gray-600
              hover:bg-gray-200
              transition
            "
          >

            <X size={22}/>

          </button>


        </div>




        {/* Body */}

        <div
          className="
            p-5
            sm:p-7
            overflow-y-auto
            max-h-[calc(92vh-90px)]
            space-y-8
          "
        >


          {/* Participant Details */}

          <section>

            <SectionTitle>
              Participant Details
            </SectionTitle>


            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >

              <InfoBox
                label="Participant Name"
                value={feedback.participantName}
              />


              <InfoBox
                label="Employee Number"
                value={feedback.employeeNo}
              />


              <InfoBox
                label="Department"
                value={feedback.department}
              />


              <InfoBox
                label="Training Date"
                value={feedback.date}
              />


              <InfoBox
                label="Course"
                value={feedback.course}
              />

            </div>

          </section>





          {/* Ratings */}

          <section>

            <SectionTitle>
              Training Rating
            </SectionTitle>


            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >

              <InfoBox
                label="Content"
                value={feedback.content}
              />


              <InfoBox
                label="Presentation"
                value={feedback.presentation}
              />


              <InfoBox
                label="Style"
                value={feedback.style}
              />


              <InfoBox
                label="Material / Visual Aid"
                value={feedback.material}
              />


              <InfoBox
                label="Venue / Environment"
                value={feedback.venue}
              />


              <InfoBox
                label="Others"
                value={feedback.others}
              />

            </div>


          </section>





          {/* Expectations */}

          <section>

            <SectionTitle>
              Expectations
            </SectionTitle>


            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-4
              "
            >

              <InfoBox
                label="Expectation Status"
                value={feedback.expectation}
              />


              <InfoBox
                label="Comments"
                value={
                  feedback.expectation === "Yes"
                    ? feedback.expectationYes
                    : feedback.expectationNo
                }
              />

            </div>

          </section>





          {/* Skills */}

          <section>

            <SectionTitle>
              Skills Application
            </SectionTitle>


            <InfoBox
              label="How skills will be applied"
              value={feedback.skills}
            />

          </section>





          {/* Suggestions */}

          <section>

            <SectionTitle>
              Suggestions
            </SectionTitle>


            <div
              className="
                bg-gray-50
                border
                border-gray-200
                rounded-xl
                p-5
                text-sm
                text-gray-700
                leading-relaxed
                min-h-24
              "
            >

              {feedback.suggestions || "No suggestions provided."}

            </div>


          </section>



        </div>


      </div>


    </div>

  );

}


export default FeedbackModal;