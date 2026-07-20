function SignatureSection({ formData, onSave, isSubmitting }) {
  return (
    <div className="mt-6 border border-black p-6 flex justify-between items-end">

      {/* Signature */}
      <div>
        <p className="font-semibold text-sm text-center">
          Participant's Signature
        </p>

        {/* Participant Name */}
        <div className="w-54 mt-10 border-b border-black text-center italic text-gray-700 pb-1">
          {formData.participantName || ""}
        </div>
      </div>

      {/* Save Button */}
      <div>
        <button
          type="button"
          onClick={onSave}
          disabled={isSubmitting}
          className={`px-6 py-2 text-white font-semibold rounded-md shadow-md transition duration-200
            ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-800 cursor-pointer"
            }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              {/* Loading Spinner */}
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>

              <span>Submitting...</span>
            </div>
          ) : (
            "Save Feedback"
          )}
        </button>
      </div>

    </div>
  );
}

export default SignatureSection;