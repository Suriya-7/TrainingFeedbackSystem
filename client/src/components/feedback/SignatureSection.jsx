function SignatureSection({ formData, onSave }) {
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
          className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-md shadow-md transition duration-200 cursor-pointer"
        >
          Save Feedback
        </button>
      </div>

    </div>
  );
}

export default SignatureSection;