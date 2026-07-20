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
    {
      id: "d",
      label: "Material/Handouts/Visual Aid",
      name: "material",
    },
    {
      id: "e",
      label: "Venue/Environment",
      name: "venue",
    },
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
    <table className="mt-6 w-full border border-black border-collapse text-sm">
      <tbody>

        {/* Header */}
        <tr>
          <td
            rowSpan={ratingItems.length + 1}
            className="border border-black text-center align-top pt-2 w-10"
          >
            1
          </td>

          <td className="border border-black p-2 font-semibold">
            Comment on the following:
          </td>

          <td className="border border-black text-center font-semibold w-28">
            Poor
          </td>

          <td className="border border-black text-center font-semibold w-32">
            Acceptable
          </td>

          <td className="border border-black text-center font-semibold w-32">
            Excellent
          </td>
        </tr>

        {ratingItems.map((item) => (
          <tr
            key={item.name}
            className={
              errors?.[item.name]
                ? "bg-red-50"
                : ""
            }
          >
            <td
              className={`border px-3 py-2 ${
                errors?.[item.name]
                  ? "border-red-500"
                  : "border-black"
              }`}
            >
              <span className="italic mr-2">{item.id}.</span>

              {item.label}

              {errors?.[item.name] && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[item.name]}
                </p>
              )}
            </td>

            {ratings.map((rating) => (
              <td
                key={rating}
                className={`text-center ${
                  errors?.[item.name]
                    ? "border border-red-500"
                    : "border border-black"
                }`}
              >
                <input
                  type="radio"
                  name={item.name}
                  value={rating}
                  checked={formData[item.name] === rating}
                  onChange={handleRatingChange}
                  className="w-4 h-4 accent-gray-700 cursor-pointer"
                />
              </td>
            ))}
          </tr>
        ))}

      </tbody>
    </table>
  );
}

export default RatingSection;