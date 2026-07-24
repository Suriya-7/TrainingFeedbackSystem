import { Eye, Trash2, Download } from "lucide-react";

function FeedbackRow({
  feedback,
  onView,
  onDelete,
  onDownload,
}) {

  return (

    <tr
      className="
        border-b
        border-gray-100
        hover:bg-gray-50
        transition
      "
    >


      {/* Submitted Date */}

      <td
        className="
          px-6
          py-4
          text-sm
          text-gray-600
          whitespace-nowrap
        "
      >
        {new Date(feedback.createdAt).toLocaleDateString()}
      </td>



      {/* Name */}

      <td
        className="
          px-6
          py-4
          text-sm
          font-semibold
          text-gray-900
          whitespace-nowrap
        "
      >
        {feedback.participantName}
      </td>




      {/* Employee Number */}

      <td
        className="
          px-6
          py-4
          text-sm
          text-gray-700
        "
      >
        {feedback.employeeNo}
      </td>




      {/* Department */}

      <td
        className="
          px-6
          py-4
          text-sm
          text-gray-700
        "
      >
        {feedback.department}
      </td>




      {/* Course */}

      <td
        className="
          px-6
          py-4
          text-sm
          text-gray-700
          max-w-[220px]
          truncate
        "
      >
        {feedback.course}
      </td>




      {/* Actions */}

      <td
        className="
          px-6
          py-4
        "
      >

        <div
          className="
            flex
            justify-center
            items-center
            gap-2
          "
        >



          {/* View */}

          <button
            onClick={() => onView(feedback)}
            className="
              group
              w-9
              h-9
              flex
              items-center
              justify-center
              rounded-xl
              bg-blue-50
              text-blue-600
              hover:bg-blue-600
              hover:text-white
              transition-all
              duration-200
            "
            title="View Feedback"
          >

            <Eye size={17}/>

          </button>





          {/* Download PDF */}

          <button
            onClick={() => onDownload(feedback)}
            className="
              group
              w-9
              h-9
              flex
              items-center
              justify-center
              rounded-xl
              bg-green-50
              text-green-600
              hover:bg-green-600
              hover:text-white
              transition-all
              duration-200
            "
            title="Download PDF"
          >

            <Download size={17}/>

          </button>





          {/* Delete */}

          <button
            onClick={() => onDelete(feedback)}
            className="
              group
              w-9
              h-9
              flex
              items-center
              justify-center
              rounded-xl
              bg-red-50
              text-red-600
              hover:bg-red-600
              hover:text-white
              transition-all
              duration-200
            "
            title="Delete Feedback"
          >

            <Trash2 size={17}/>

          </button>



        </div>


      </td>


    </tr>

  );
}

export default FeedbackRow;