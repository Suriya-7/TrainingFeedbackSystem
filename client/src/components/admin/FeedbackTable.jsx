import { Eye, FileText, Trash2 } from "lucide-react";

function FeedbackTable({ reports = [] }) {
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
        flex
        items-center
        justify-between
        px-5
        py-4
        border-b
        "
      >
        <div>
          <h2
            className="
            text-lg
            font-semibold
            text-gray-800
            "
          >
            Feedback Reports
          </h2>

          <p
            className="
            text-sm
            text-gray-500
            "
          >
            List of submitted feedback records
          </p>
        </div>

        <span
          className="
          bg-gray-100
          text-gray-700
          px-3
          py-1
          rounded-full
          text-sm
          font-medium
          "
        >
          {reports.length} Records
        </span>
      </div>

      <div
        className="
        overflow-x-auto
        "
      >
        <table
          className="
          min-w-full
          text-sm
          "
        >
          <thead>
            <tr
              className="
              bg-gray-900
              text-white
              "
            >
              <th className="px-5 py-3 text-left font-medium">Emp No</th>

              <th className="px-5 py-3 text-left font-medium">Name</th>

              <th className="px-5 py-3 text-left font-medium">Department</th>

              <th className="px-5 py-3 text-left font-medium">Course</th>

              <th className="px-5 py-3 text-left font-medium">Date</th>

              <th className="px-5 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="
                  text-center
                  py-12
                  text-gray-500
                  "
                >
                  No feedback records found
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr
                  key={report._id}

                  className="
                border-b
                hover:bg-gray-50
                transition
                "
                >
                  {/* Employee */}

                  <td
                    className="
                  px-5
                  py-4
                  font-semibold
                  text-gray-800
                  "
                  >
                    {report.employeeNo}
                  </td>

                  {/* Name */}

                  <td
                    className="
                  px-5
                  py-4
                  "
                  >
                    <div
                      className="
                    flex
                    items-center
                    gap-3
                    "
                    >
                      <div
                        className="
                      w-9
                      h-9
                      rounded-full
                      bg-gray-900
                      text-white
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-semibold
                      "
                      >
                        {report.participantName?.charAt(0)?.toUpperCase()}
                      </div>

                      <span
                        className="
                      font-medium
                      text-gray-800
                      "
                      >
                        {report.participantName}
                      </span>
                    </div>
                  </td>

                  {/* Department */}

                  <td
                    className="
                  px-5
                  py-4
                  "
                  >
                    <span
                      className="
                    bg-blue-50
                    text-blue-700
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-medium
                    "
                    >
                      {report.department}
                    </span>
                  </td>

                  {/* Course */}

                  <td
                    className="
                  px-5
                  py-4
                  text-gray-700
                  "
                  >
                    {report.course}
                  </td>

                  {/* Date */}

                  <td
                    className="
                  px-5
                  py-4
                  text-gray-600
                  "
                  >
                    {report.date}
                  </td>

                  {/* Actions */}

                  <td
                    className="
                  px-5
                  py-4
                  "
                  >
                    <div
                      className="
                    flex
                    justify-center
                    gap-2
                    "
                    >
                      <button
                        className="
                      flex
                      items-center
                      gap-1
                      bg-gray-900
                      hover:bg-black
                      text-white
                      px-3
                      py-1.5
                      rounded-lg
                      text-xs
                      "
                      >
                        <Eye size={14} />
                        View
                      </button>

                      <button
                        className="
                      flex
                      items-center
                      gap-1
                      bg-green-600
                      hover:bg-green-700
                      text-white
                      px-3
                      py-1.5
                      rounded-lg
                      text-xs
                      "
                      >
                        <FileText size={14} />
                        PDF
                      </button>

                      <button
                        className="
                      flex
                      items-center
                      gap-1
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      px-3
                      py-1.5
                      rounded-lg
                      text-xs
                      "
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FeedbackTable;
