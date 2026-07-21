import FeedbackRow from "./FeedbackRow";

function FeedbackTable({
  feedbacks = [],
  loading = false,
  onView = () => {},
  onDelete = () => {},
  onDownload = () => {},
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <p className="text-lg font-medium text-gray-600">
          Loading feedbacks...
        </p>
      </div>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          No Feedback Found
        </h2>

        <p className="mt-2 text-gray-500">
          Submitted feedback records will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-100 border-b">

            <tr>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Date
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Participant
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Employee No
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Department
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold">
                Course
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {feedbacks.map((feedback) => (
              <FeedbackRow
                key={feedback._id}
                feedback={feedback}
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