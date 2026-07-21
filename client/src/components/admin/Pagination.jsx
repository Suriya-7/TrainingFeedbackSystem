function Pagination({
  currentPage,
  totalPages,
  onPageChange
}) {

  return (

    <div className="
      flex
      justify-center
      items-center
      gap-3
      mt-6
    ">


      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          px-5
          py-2
          rounded-xl
          bg-white
          border
          border-gray-200
          text-gray-700
          hover:bg-gray-100
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >

        Previous

      </button>



      <div className="
        px-5
        py-2
        rounded-xl
        bg-gray-900
        text-white
        font-medium
      ">

        {currentPage}

      </div>



      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          px-5
          py-2
          rounded-xl
          bg-white
          border
          border-gray-200
          text-gray-700
          hover:bg-gray-100
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >

        Next

      </button>


    </div>

  );

}


export default Pagination;