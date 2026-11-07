import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, ChevronRight, PartyPopper, CalendarDays } from "lucide-react";
import { toast } from "react-toastify";

import EmployeeLayout from "../components/layout/EmployeeLayout";
import EmptyState from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { getPendingFeedback } from "../services/employeeApi";
import { formatDate } from "../utils/format";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPendingFeedback()
      .then((res) => setPending(res.data))
      .catch(() => toast.error("Could not load your trainings."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <EmployeeLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Your trainings</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          {loading
            ? "Checking for feedback forms…"
            : pending.length > 0
            ? `${pending.length} feedback form${pending.length > 1 ? "s" : ""} waiting for you.`
            : "You’re all caught up."}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-[84px] rounded-2xl" />
          ))}
        </div>
      ) : pending.length === 0 ? (
        <EmptyState
          icon={PartyPopper}
          title="No feedback pending"
          text="When a training is assigned to you, its feedback form will show up here."
        />
      ) : (
        <ul className="space-y-3">
          {pending.map((item) => (
            <li key={item.RECORD_ID}>
              <button
                onClick={() => navigate(`/employee/feedback/${item.RECORD_ID}`)}
                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-card transition hover:border-brand-300 hover:shadow-lift sm:p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <ClipboardList size={22} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-slate-900">{item.COURSE_NAME}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={13} />
                    Assigned {formatDate(item.ASSIGNED_AT)}
                  </p>
                </div>
                <span className="hidden rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 sm:inline">
                  Fill feedback
                </span>
                <ChevronRight size={20} className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </EmployeeLayout>
  );
}

export default EmployeeDashboard;
