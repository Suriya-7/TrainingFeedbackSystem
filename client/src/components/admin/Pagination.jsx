function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          px-4
          py-2
          rounded-xl
          border
          border-gray-300
          hover:bg-gray-100
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        Previous
      </button>

      {/* Page Numbers */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`
            px-4
            py-2
            rounded-xl
            border
            transition

            ${
              currentPage === page
                ? "bg-black text-white border-black"
                : "border-gray-300 hover:bg-gray-100"
            }
          `}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          px-4
          py-2
          rounded-xl
          border
          border-gray-300
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
