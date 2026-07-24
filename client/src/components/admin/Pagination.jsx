import { ChevronLeft, ChevronRight } from "lucide-react";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {

  if (totalPages <= 1) {
    return null;
  }


  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }



  return (

    <div
      className="
        mt-6
        flex
        flex-wrap
        items-center
        justify-center
        gap-2
      "
    >


      {/* Previous */}

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          flex
          items-center
          gap-1
          px-4
          py-2
          rounded-xl
          border
          border-gray-300
          bg-white
          text-sm
          font-medium
          text-gray-700
          hover:bg-gray-100
          transition
          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      >

        <ChevronLeft size={16}/>

        Previous

      </button>





      {/* Page Numbers */}

      <div
        className="
          flex
          items-center
          gap-2
          overflow-x-auto
          max-w-full
        "
      >

        {pages.map((page) => (

          <button

            key={page}

            onClick={() => onPageChange(page)}

            className={`
              min-w-10
              h-10
              px-3
              rounded-xl
              border
              text-sm
              font-semibold
              transition-all

              ${
                currentPage === page

                ? 
                  "bg-gray-900 text-white border-gray-900 shadow-sm"

                :

                  "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"

              }

            `}

          >

            {page}

          </button>

        ))}

      </div>





      {/* Next */}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          flex
          items-center
          gap-1
          px-4
          py-2
          rounded-xl
          border
          border-gray-300
          bg-white
          text-sm
          font-medium
          text-gray-700
          hover:bg-gray-100
          transition
          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      >

        Next

        <ChevronRight size={16}/>

      </button>



    </div>

  );
}


export default Pagination;