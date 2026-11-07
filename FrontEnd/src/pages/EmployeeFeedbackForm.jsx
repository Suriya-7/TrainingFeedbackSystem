import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Check, CheckCircle2, User, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import EmployeeLayout from "../components/layout/EmployeeLayout";
import Button from "../components/ui/Button";
import { PageLoader } from "../components/ui/Skeleton";
import { getFeedbackRecord, submitFeedback } from "../services/employeeApi";

// Shared PCs: sign the employee out as soon as their feedback is submitted,
// so the next person starts from a clean login. Set to false to go back to the dashboard instead.
const AUTO_LOGOUT_AFTER_SUBMIT = true;
const LOGOUT_COUNTDOWN_SECONDS = 5;

const RATINGS = ["Excellent", "Very Good", "Good", "Acceptable", "Poor"];

const RATING_QUESTIONS = [
  { key: "contentRating", label: "Content" },
  { key: "presentationRating", label: "Presentation" },
  { key: "styleRating", label: "Style" },
  { key: "materialRating", label: "Material / Handouts / Visual Aid" },
  { key: "venueRating", label: "Venue / Environment" },
  { key: "othersRating", label: "Others" },
];

const TOTAL_REQUIRED = RATING_QUESTIONS.length + 2; // six ratings + two Yes/No

// A row of radio "chips". Real radio inputs, so keyboard and screen readers work.
function Choice({ name, options, value, onChange, cols }) {
  return (
    <div role="radiogroup" className={`grid gap-2 ${cols}`}>
      {options.map((option) => {
        const selected = value === option;
        return (
          <label
            key={option}
            className={`flex h-11 items-center justify-center rounded-xl border px-2 text-center text-[13px] font-semibold transition select-none has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-500 ${
              selected
                ? "border-brand-700 bg-brand-700 text-white shadow-sm"
                : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:bg-brand-50"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={selected}
              onChange={() => onChange(option)}
              className="sr-only"
            />
            {option}
          </label>
        );
      })}
    </div>
  );
}

function Question({ index, label, children }) {
  return (
    <div className="border-b border-slate-100 py-5 last:border-0 md:grid md:grid-cols-[minmax(0,1fr)_29rem] md:items-center md:gap-8">
      <p className="mb-3 text-sm font-semibold text-slate-900 md:mb-0">
        {index && <span className="mr-2 text-slate-400">{index}</span>}
        {label}
      </p>
      {children}
    </div>
  );
}

function Section({ number, title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="mb-1 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
          {number}
        </span>
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function EmployeeFeedbackForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(LOGOUT_COUNTDOWN_SECONDS);

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

  // After a successful submit: count down, then go to the login page.
  useEffect(() => {
    if (!done || !AUTO_LOGOUT_AFTER_SUBMIT) return;
    if (secondsLeft <= 0) {
      navigate("/");
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [done, secondsLeft, navigate]);

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const answered =
    RATING_QUESTIONS.filter((q) => form[q.key]).length +
    (form.expectationMet ? 1 : 0) +
    (form.skillsApplication ? 1 : 0);
  const isComplete = answered === TOTAL_REQUIRED;

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
      confirmButtonColor: "#2833a0",
      cancelButtonColor: "#64748b",
      customClass: { popup: "!rounded-3xl" },
    });
    if (!confirm.isConfirmed) return;

    try {
      setSubmitting(true);
      await submitFeedback(id, form);
      if (AUTO_LOGOUT_AFTER_SUBMIT) localStorage.removeItem("employeeToken");
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !record) {
    return (
      <EmployeeLayout>
        <PageLoader />
      </EmployeeLayout>
    );
  }

  /* ---------------- Thank-you screen ---------------- */
  if (done) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-card">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={34} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Thank you!</h1>
          <p className="mt-2 text-sm text-slate-500">
            Your feedback for <span className="font-semibold text-slate-700">{record.COURSE_NAME}</span> has been
            submitted.
          </p>

          {AUTO_LOGOUT_AFTER_SUBMIT ? (
            <>
              <p className="mt-5 text-xs text-slate-400">
                You’ve been signed out for security. Returning to sign in in {Math.max(secondsLeft, 0)}s…
              </p>
              <Button className="mt-5 w-full" size="lg" onClick={() => navigate("/")}>
                Back to sign in
              </Button>
            </>
          ) : (
            <Button className="mt-6 w-full" size="lg" onClick={() => navigate("/employee/dashboard")}>
              Back to my trainings
            </Button>
          )}
        </div>
      </div>
    );
  }

  const pct = (answered / TOTAL_REQUIRED) * 100;

  return (
    <EmployeeLayout width="max-w-3xl">
      <Link
        to="/employee/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} /> My trainings
      </Link>

      {/* Header */}
      <div className="rounded-2xl bg-brand-900 p-5 text-white shadow-card sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">Training feedback</p>
        <h1 className="mt-1.5 text-xl font-bold leading-snug sm:text-2xl">{record.COURSE_NAME}</h1>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-brand-100">
          <span className="flex items-center gap-2">
            <User size={15} className="text-brand-300" /> {record.PARTICIPANT_NAME}
          </span>
          <span className="flex items-center gap-2">
            <Building2 size={15} className="text-brand-300" /> {record.DEPARTMENT}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5 pb-28">
        <Section number="1" title="Comment on the following">
          {RATING_QUESTIONS.map((q, i) => (
            <Question key={q.key} index={`${String.fromCharCode(97 + i)}.`} label={q.label}>
              <Choice
                name={q.key}
                options={RATINGS}
                value={form[q.key]}
                onChange={update(q.key)}
                cols="grid-cols-3 sm:grid-cols-5"
              />
            </Question>
          ))}
        </Section>

        <Section number="2" title="Expectations">
          <Question label="Were your expectations met?">
            <Choice
              name="expectationMet"
              options={["Yes", "No"]}
              value={form.expectationMet}
              onChange={update("expectationMet")}
              cols="grid-cols-2"
            />
          </Question>
        </Section>

        <Section number="3" title="Application">
          <Question label="Will you be able to use the skills learnt during the programme?">
            <Choice
              name="skillsApplication"
              options={["Yes", "No"]}
              value={form.skillsApplication}
              onChange={update("skillsApplication")}
              cols="grid-cols-2"
            />
          </Question>
        </Section>

        <Section number="4" title="Suggestions">
          <textarea
            value={form.suggestions}
            onChange={(e) => setForm((prev) => ({ ...prev, suggestions: e.target.value }))}
            placeholder="Optional — anything you'd like to add"
            rows={4}
            maxLength={2000}
            className="mt-3 w-full resize-none rounded-xl border border-slate-300 p-4 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 md:text-sm"
          />
        </Section>

        {/* Sticky submit bar */}
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center gap-4">
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-600">
                  {isComplete ? "All answered — ready to submit" : `${answered} of ${TOTAL_REQUIRED} answered`}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${isComplete ? "bg-emerald-500" : "bg-brand-600"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <Button type="submit" size="lg" icon={Check} loading={submitting} disabled={!isComplete} className="shrink-0">
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </div>
      </form>
    </EmployeeLayout>
  );
}

export default EmployeeFeedbackForm;
