import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { getFeedbackRecord, submitFeedback } from "../services/employeeApi";

const RATINGS = ["Excellent", "Very Good", "Good", "Acceptable", "Poor"];

const RATING_QUESTIONS = [
  { key: "contentRating", label: "Content" },
  { key: "presentationRating", label: "Presentation" },
  { key: "styleRating", label: "Style" },
  { key: "materialRating", label: "Material / Handouts / Visual Aid" },
  { key: "venueRating", label: "Venue / Environment" },
  { key: "othersRating", label: "Others" },
];

function RatingRow({ label, value, onChange }) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <p className="text-sm font-medium text-gray-900 mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {RATINGS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold border transition ${
              value === option
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function YesNoRow({ label, value, onChange }) {
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <p className="text-sm font-medium text-gray-900 mb-3">{label}</p>
      <div className="flex gap-2">
        {["Yes", "No"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition ${
              value === option
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmployeeFeedbackForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    contentRating: "",
    presentationRating: "",
    styleRating: "",
    materialRating: "",
    venueRating: "",
    othersRating: "",
    expectationMet: "",
    skillsApplication: "",
    suggestions: "",
  });

  useEffect(() => {
    getFeedbackRecord(id)
      .then((res) => {
        if (res.data.STATUS === "COMPLETED") {
          toast.info("You've already submitted this feedback.");
          navigate("/employee/dashboard");
          return;
        }
        setRecord(res.data);
      })
      .catch(() => {
        toast.error("Could not load this training.");
        navigate("/employee/dashboard");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const isComplete =
    RATING_QUESTIONS.every((q) => form[q.key]) && form.expectationMet && form.skillsApplication;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isComplete) {
      toast.error("Please answer every question before submitting.");
      return;
    }

    const confirm = await Swal.fire({
      title: "Submit feedback?",
      text: "You won't be able to change it after this.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Submit",
      confirmButtonColor: "#111827",
    });
    if (!confirm.isConfirmed) return;

    try {
      setSubmitting(true);
      await submitFeedback(id, form);
      toast.success("Feedback submitted — thank you!");
      navigate("/employee/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/employee/dashboard")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-lg font-bold text-gray-900">{record.COURSE_NAME}</h1>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Participant</p>
                <p className="font-medium text-gray-900">{record.PARTICIPANT_NAME}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Department</p>
                <p className="font-medium text-gray-900">{record.DEPARTMENT}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                1. Comment on the following
              </p>
              {RATING_QUESTIONS.map((q) => (
                <RatingRow key={q.key} label={q.label} value={form[q.key]} onChange={update(q.key)} />
              ))}
            </div>

            <div className="px-6 pt-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                2. Expectations
              </p>
              <YesNoRow
                label="Were your expectations met?"
                value={form.expectationMet}
                onChange={update("expectationMet")}
              />
            </div>

            <div className="px-6 pt-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
                3. Application
              </p>
              <YesNoRow
                label="Will you be able to use the skills learnt during the programme?"
                value={form.skillsApplication}
                onChange={update("skillsApplication")}
              />
            </div>

            <div className="px-6 pt-2 pb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                4. Suggestions
              </p>
              <textarea
                value={form.suggestions}
                onChange={(e) => setForm((prev) => ({ ...prev, suggestions: e.target.value }))}
                placeholder="Optional — anything you'd like to add"
                rows={4}
                className="w-full p-4 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition resize-none"
              />
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check size={18} />
                {submitting ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployeeFeedbackForm;
