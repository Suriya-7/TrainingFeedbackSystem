import { Search, SlidersHorizontal, CalendarDays } from "lucide-react";

function SearchFilterBar({
  searchTerm,
  onSearch,

  departments,
  selectedDepartment,
  onDepartmentChange,

  selectedDate,
  onDateChange,
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
          gap-2
          mb-5
        "
      >
        <div
          className="
            w-9
            h-9
            rounded-xl
            bg-gray-900
            text-white
            flex
            items-center
            justify-center
          "
        >
          <SlidersHorizontal size={18} />
        </div>

        <div>
          <h3
            className="
              text-base
              font-bold
              text-gray-900
            "
          >
            Search & Filter
          </h3>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            Find feedback records quickly
          </p>
        </div>
      </div>

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-4
          gap-4
        "
      >
        {/* Search */}

        <div
          className="
            lg:col-span-2
          "
        >
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
                focus:outline-none
                focus:ring-2
                focus:ring-gray-900
                transition
              "
            />
          </div>
        </div>

        {/* Department */}

        <div>
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
              transition
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

        {/* Date Filter */}

        <div>
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
            Training Date
          </label>

          <div className="relative">
            <CalendarDays
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
              type="date"

              value={selectedDate}

              onChange={(e) => onDateChange(e.target.value)}

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
                focus:outline-none
                focus:ring-2
                focus:ring-gray-900
                transition
              "
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchFilterBar;
