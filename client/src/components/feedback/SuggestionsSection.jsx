function SuggestionsSection({ formData, handleChange }) {
  return (
    <table className="w-full border border-black border-collapse text-sm mt-6">
      <tbody>
        <tr>
          <td className="border border-black w-10 text-center align-top p-3">
            4
          </td>

          <td className="border border-black p-4">
            <p className="font-semibold text-base mb-4">
              Suggestions for improving the programme:
            </p>

            <textarea
              name="suggestions"
              value={formData.suggestions}
              onChange={handleChange}
              rows="6"
              placeholder="Share your valuable suggestions here..."
              className="w-full px-3 py-2 border border-gray-500 rounded-md focus:ring-gray-500 focus:border-gray-500 transition duration-200"
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default SuggestionsSection;