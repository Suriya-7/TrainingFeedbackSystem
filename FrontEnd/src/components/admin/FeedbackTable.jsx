import FeedbackRow from "./FeedbackRow";

function FeedbackTable({
  feedbacks = [],
  loading = false,
  downloadingId = null,
  onView = () => {},
  onDelete = () => {},
  onDownload = () => {},
}) {
  if (loading) {
    return (
      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-200
          shadow-sm
          p-12
          text-center
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            gap-3
          "
        >
          <div
            className="
              w-10
              h-10
              rounded-full
              border-4
              border-gray-300
              border-t-gray-900
              animate-spin
            "
          />

          <p
            className="
              text-sm
              font-medium
              text-gray-600
            "
          >
            Loading feedback records...
          </p>
        </div>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div
        className="
          bg-white
          rounded-2xl
          border
          border-gray-200
          shadow-sm
          p-12
          text-center
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
          "
        >
          <div
            className="
              w-14
              h-14
              rounded-2xl
              bg-gray-100
              flex
              items-center
              justify-center
              mb-4
              text-gray-400
            "
          >
            📄
          </div>

          <h2
            className="
              text-xl
              font-semibold
              text-gray-800
            "
          >
            No Feedback Found
          </h2>

          <p
            className="
              mt-2
              text-sm
              text-gray-500
            "
          >
            Submitted feedback records will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-gray-200
        shadow-sm
        overflow-hidden
      "
    >
      {/* Table Header */}

      <div
        className="
          px-6
          py-4
          border-b
          border-gray-200
          flex
          items-center
          justify-between
          bg-gray-50
        "
      >
        <div>
          <h2
            className="
              text-base
              font-bold
              text-gray-900
            "
          >
            Feedback Records
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              mt-1
            "
          >
            List of submitted training feedback
          </p>
        </div>

        <div
          className="
            text-sm
            font-medium
            text-gray-600
          "
        >
          {feedbacks.length} Records
        </div>
      </div>

      {/* Table */}

      <div
        className="
          overflow-x-auto
        "
      >
        <table
          className="
            min-w-full
            divide-y
            divide-gray-200
          "
        >
          <thead
            className="
              bg-gray-100
            "
          >
            <tr>
              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  uppercase
                  tracking-wider
                  font-semibold
                  text-gray-600
                "
              >
                Date
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  uppercase
                  tracking-wider
                  font-semibold
                  text-gray-600
                "
              >
                Participant
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  uppercase
                  tracking-wider
                  font-semibold
                  text-gray-600
                "
              >
                Employee No
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  uppercase
                  tracking-wider
                  font-semibold
                  text-gray-600
                "
              >
                Department
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-left
                  text-xs
                  uppercase
                  tracking-wider
                  font-semibold
                  text-gray-600
                "
              >
                Course
              </th>

              <th
                className="
                  px-6
                  py-4
                  text-center
                  text-xs
                  uppercase
                  tracking-wider
                  font-semibold
                  text-gray-600
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody
            className="
              divide-y
              divide-gray-100
              bg-white
            "
          >
            {feedbacks.map((feedback) => (
              <FeedbackRow
                key={feedback._id}
                feedback={feedback}
                downloadingId={downloadingId}
                onView={onView}
                onDelete={onDelete}
                onDownload={onDownload}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeedbackTable;