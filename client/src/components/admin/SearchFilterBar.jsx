import { Search, SlidersHorizontal } from "lucide-react";

function SearchFilterBar({
  searchTerm,
  onSearch,

  departments,
  selectedDepartment,
  onDepartmentChange,
}) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-sm
        border
        border-gray-200
        p-5
        mb-6
      "
    >
      {/* Header */}

      <div
        className="
          flex
          items-center
          gap-3
          mb-6
        "
      >
        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-gray-900
            text-white
            flex
            items-center
            justify-center
            shrink-0
          "
        >
          <SlidersHorizontal size={18} />
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-900">
            Search & Filter
          </h3>

          <p className="text-sm text-gray-500">
            Find feedback records quickly
          </p>
        </div>
      </div>

      {/* Filters */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          gap-5
          items-end
        "
      >
        {/* Search */}

        <div className="flex-1 w-full">
          <label
            className="
              block
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-gray-500
              mb-2
            "
          >
            Search
          </label>

          <div className="relative">
            <Search
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search participant, employee no or course..."
              className="
                w-full
                pl-11
                pr-4
                py-3
                rounded-xl
                border
                border-gray-300
                text-sm
                text-gray-700
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-gray-900
                focus:border-gray-900
                transition-all
              "
            />
          </div>
        </div>

        {/* Department */}

        <div className="w-full lg:w-72">
          <label
            className="
              block
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-gray-500
              mb-2
            "
          >
            Department
          </label>

          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="
              w-full
              px-4
              py-3
              rounded-xl
              border
              border-gray-300
              bg-white
              text-sm
              text-gray-700
              focus:outline-none
              focus:ring-2
              focus:ring-gray-900
              focus:border-gray-900
              transition-all
              cursor-pointer
            "
          >
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default SearchFilterBar;