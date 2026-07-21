import { Search } from "lucide-react";

function SearchFilterBar({
  searchTerm,
  onSearch,
  departments,
  selectedDepartment,
  onDepartmentChange,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">

        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search by participant, employee no or course..."
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        {/* Department Filter */}
        <div className="w-full lg:w-72">
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="
              w-full
              px-4
              py-3
              border
              border-gray-300
              rounded-xl
              bg-white
              focus:outline-none
              focus:ring-2
              focus:ring-black
              transition
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