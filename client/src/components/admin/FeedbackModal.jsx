import { X } from "lucide-react";

/* ===========================
   Reusable Info Box Component
=========================== */

function InfoBox({ label, value }) {
  return (
    <div
      className="
        bg-gray-50
        border
        border-gray-200
        rounded-xl
        p-4
      "
    >
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
        {label}
      </p>

      <p className="text-sm font-semibold text-gray-900 break-words">
        {value || "-"}
      </p>
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
        bg-black/50
        flex
        items-center
        justify-center
        z-50
        px-4
      "
    >
      <div
        className="
          bg-white
          w-full
          max-w-4xl
          rounded-2xl
          shadow-2xl
          max-h-[90vh]
          overflow-hidden
        "
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            px-6
            py-4
            border-b
            border-gray-200
          "
        >
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Feedback Details
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Complete training feedback information
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              p-2
              rounded-xl
              hover:bg-gray-100
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}

        <div
          className="
            p-6
            overflow-y-auto
            max-h-[calc(90vh-80px)]
            space-y-6
          "
        >
          {/* Participant Details */}

          <section>
            <h3
              className="
                text-lg
                font-bold
                text-gray-900
                mb-4
              "
            >
              Participant Details
            </h3>

            <div
              className="
                grid
                md:grid-cols-2
                gap-4
              "
            >
              <InfoBox
                label="Participant Name"
                value={feedback.participantName}
              />

              <InfoBox label="Employee Number" value={feedback.employeeNo} />

              <InfoBox label="Department" value={feedback.department} />

              <InfoBox label="Training Date" value={feedback.date} />

              <InfoBox label="Course" value={feedback.course} />
            </div>
          </section>

          {/* Rating Details */}

          <section>
            <h3
              className="
                text-lg
                font-bold
                text-gray-900
                mb-4
              "
            >
              Training Rating
            </h3>

            <div
              className="
                grid
                md:grid-cols-2
                gap-4
              "
            >
              <InfoBox label="Content" value={feedback.content} />

              <InfoBox label="Presentation" value={feedback.presentation} />

              <InfoBox label="Style" value={feedback.style} />

              <InfoBox
                label="Material / Visual Aid"
                value={feedback.material}
              />

              <InfoBox label="Venue / Environment" value={feedback.venue} />

              <InfoBox label="Others" value={feedback.others} />
            </div>
          </section>

          {/* Expectations */}

          <section>
            <h3
              className="
                text-lg
                font-bold
                text-gray-900
                mb-4
              "
            >
              Expectations
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
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
            <h3
              className="
                text-lg
                font-bold
                text-gray-900
                mb-4
              "
            >
              Skills Application
            </h3>

            <InfoBox
              label="Will apply learned skills"
              value={feedback.skills}
            />
          </section>

          {/* Suggestions */}

          <section>
            <h3
              className="
                text-lg
                font-bold
                text-gray-900
                mb-4
              "
            >
              Suggestions
            </h3>

            <div
              className="
                bg-gray-50
                border
                border-gray-200
                rounded-xl
                p-4
                text-sm
                text-gray-700
                min-h-20
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
