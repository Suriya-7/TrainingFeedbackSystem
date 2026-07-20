function RatingSection({
  formData,
  handleChange,
  errors,
  setErrors,
}) {

  const ratingItems = [
    { id: "a", label: "Content", name: "content" },
    { id: "b", label: "Presentation", name: "presentation" },
    { id: "c", label: "Style", name: "style" },
    { id: "d", label: "Material / Handouts / Visual Aid", name: "material" },
    { id: "e", label: "Venue / Environment", name: "venue" },
    { id: "f", label: "Others", name: "others" },
  ];

  const ratings = ["Poor", "Acceptable", "Excellent"];

  const handleRatingChange = (e) => {
    handleChange(e);

    const { name } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6 mt-4">

      <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-3 mb-5">
        Comment on the following
      </h3>

      <div className="space-y-4">
        {ratingItems.map((item) => (
          <div
            key={item.name}
            className={`
            flex flex-col sm:flex-row sm:items-center sm:justify-between
            gap-3 sm:gap-4
            rounded-lg border p-4
            ${errors?.[item.name] ? "border-red-500 bg-red-50" : "border-gray-200"}
            `}
          >
            <div>
              <p className="text-sm font-medium text-gray-800">
                <span className="italic mr-2">{item.id}.</span>
                {item.label}
              </p>
              {errors?.[item.name] && (
                <p className="text-red-500 text-xs mt-1">{errors[item.name]}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 sm:justify-end">
              {ratings.map((rating) => (
                <label
                  key={rating}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <span className="relative flex items-center justify-center w-4 h-4">
                    <input
                      type="radio"
                      name={item.name}
                      value={rating}
                      checked={formData[item.name] === rating}
                      onChange={handleRatingChange}
                      className="peer sr-only"
                    />
                    <span
                      className="
                      w-4 h-4 rounded-full border-2 border-gray-400 bg-white
                      transition
                      peer-checked:border-gray-700
                      peer-focus-visible:ring-2
                      peer-focus-visible:ring-gray-400
                      "
                    />
                    <span
                      className="
                      absolute
                      w-2 h-2 rounded-full bg-gray-800
                      opacity-0
                      transition
                      peer-checked:opacity-100
                      pointer-events-none
                      "
                    />
                  </span>
                  {rating}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default RatingSection;