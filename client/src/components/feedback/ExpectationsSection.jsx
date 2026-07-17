function ExpectationsSection({ formData, handleChange }) {
  return (
    <table className="w-full border border-black border-collapse text-sm mt-4">
      <tbody>

        {/* Question */}
        <tr>
          <td className="border border-black p-2 w-10 text-center">
            2
          </td>

          <td className="border border-black p-2">
            <div className="flex justify-between items-center">

              <span className="font-semibold">
                Were your expectations met?
              </span>

              <div className="flex gap-8">

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="expectation"
                    value="Yes"
                    className="w-4 h-4 accent-gray-700"
                    checked={formData.expectation === "Yes"}
                    onChange={handleChange}
                  />
                  Yes
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="expectation"
                    value="No"
                    className="w-4 h-4 accent-gray-700"
                    checked={formData.expectation === "No"}
                    onChange={handleChange}
                  />
                  No
                </label>

              </div>

            </div>
          </td>
        </tr>

        {/* Yes Section */}
        {formData.expectation === "Yes" && (
          <tr>
            <td className="border border-black text-center">
              a
            </td>

            <td className="border border-black p-2">
              <p className="mb-2">
                Please list major areas of your learning:
              </p>

              <textarea
                name="expectationYes"
                value={formData.expectationYes}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-gray-500 focus:border-gray-500 transition duration-200"
                placeholder="Enter your learning..."
              />
            </td>
          </tr>
        )}

        {/* No Section */}
        {formData.expectation === "No" && (
          <tr>
            <td className="border border-black text-center">
              b
            </td>

            <td className="border border-black p-2">
              <p className="mb-2">
                Please give reasons:
              </p>

              <textarea
                name="expectationNo"
                value={formData.expectationNo}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-gray-500 focus:border-gray-500 transition duration-200"
                placeholder="Enter the reason..."
              />
            </td>
          </tr>
        )}

      </tbody>
    </table>
  );
}

export default ExpectationsSection;