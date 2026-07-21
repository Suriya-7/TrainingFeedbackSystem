import { Eye, Trash2, Download } from "lucide-react";

function FeedbackRow({
  feedback,
  onView,
  onDelete,
  onDownload,
}) {
  return (
    <tr className="border-b hover:bg-gray-50 transition">

      <td className="px-6 py-4">
        {new Date(feedback.createdAt).toLocaleDateString()}
      </td>

      <td className="px-6 py-4 font-medium">
        {feedback.participantName}
      </td>

      <td className="px-6 py-4">
        {feedback.employeeNo}
      </td>

      <td className="px-6 py-4">
        {feedback.department}
      </td>

      <td className="px-6 py-4">
        {feedback.course}
      </td>

      <td className="px-6 py-4">

        <div className="flex justify-center gap-2">

          <button
            onClick={() => onView(feedback)}
            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
            title="View"
          >
            <Eye size={18} />
          </button>

          <button
            onClick={() => onDelete(feedback)}
            className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>

          <button
            onClick={() => onDownload(feedback)}
            className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
            title="Download PDF"
          >
            <Download size={18} />
          </button>

        </div>

      </td>

    </tr>
  );
}

export default FeedbackRow;