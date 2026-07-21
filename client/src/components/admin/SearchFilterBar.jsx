import { useState } from "react";
import { Search, RotateCcw, Filter } from "lucide-react";

function SearchFilterBar({ onSearch, departments = [], courses = [] }) {
  const [filters, setFilters] = useState({
    keyword: "",

    department: "",

    course: "",

    dateFrom: "",

    dateTo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,

      [name]: value,
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    const clearData = {
      keyword: "",

      department: "",

      course: "",

      dateFrom: "",

      dateTo: "",
    };

    setFilters(clearData);

    onSearch(clearData);
  };

  const inputClass = `
    w-full
    border
    border-gray-300
    rounded-lg
    px-3
    py-2
    text-sm
    outline-none
    focus:ring-2
    focus:ring-gray-800
  `;

  return (
    <div
      className="
      bg-white
      border
      border-gray-200
      shadow-sm
      rounded-xl
      p-4
      mb-5
      "
    >
      {/* Header */}

      <div
        className="
        flex
        items-center
        gap-2
        mb-4
        "
      >
        <div
          className="
          bg-gray-900
          text-white
          p-1.5
          rounded-lg
          "
        >
          <Filter size={15} />
        </div>

        <h3
          className="
          text-sm
          font-semibold
          text-gray-800
          "
        >
          Search & Filter
        </h3>
      </div>

      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-6
        gap-3
        "
      >
        {/* Search */}

        <div className="lg:col-span-2">
          <div className="relative">
            <Search
              size={15}
              className="
              absolute
              left-3
              top-2.5
              text-gray-400
              "
            />

            <input
              type="text"

              name="keyword"

              value={filters.keyword}

              onChange={handleChange}

              placeholder="Name / Employee No"

              className={`
                ${inputClass}
                pl-9
              `}
            />
          </div>
        </div>

        {/* Department */}

        <select
          name="department"

          value={filters.department}

          onChange={handleChange}

          className={inputClass}
        >
          <option value="">All Departments</option>

          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        {/* Course */}

        <select
          name="course"

          value={filters.course}

          onChange={handleChange}

          className={inputClass}
        >
          <option value="">All Courses</option>

          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>

        {/* From */}

        <input
          type="date"

          name="dateFrom"

          value={filters.dateFrom}

          onChange={handleChange}

          className={inputClass}
        />

        {/* To */}

        <input
          type="date"

          name="dateTo"

          value={filters.dateTo}

          onChange={handleChange}

          className={inputClass}
        />
      </div>

      {/* Buttons */}

      <div
        className="
        flex
        justify-end
        gap-2
        mt-4
        "
      >
        <button
          onClick={handleClear}

          className="
          flex
          items-center
          gap-1
          px-4
          py-2
          rounded-lg
          text-sm
          bg-gray-100
          hover:bg-gray-200
          "
        >
          <RotateCcw size={14} />
          Clear
        </button>

        <button
          onClick={handleSearch}

          className="
          px-5
          py-2
          rounded-lg
          text-sm
          bg-gray-900
          hover:bg-black
          text-white
          "
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchFilterBar;
