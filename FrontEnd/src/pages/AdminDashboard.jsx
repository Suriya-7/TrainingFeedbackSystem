import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  UserRound,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

import AdminLayout from "../components/layout/AdminLayout";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import ProgressBar from "../components/ui/ProgressBar";
import EmptyState from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { getTrainings } from "../services/trainingApi";
import authService from "../services/authService";
import { formatDate } from "../utils/format";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "open", label: "In progress" },
  { key: "done", label: "Completed" },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getTrainings()
      .then((res) => setTrainings(res.data))
      .catch(() => toast.error("Could not load trainings."))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo(
    () =>
      trainings.map((t) => {
        const pending = Number(t.PENDING_COUNT || 0);
        const completed = Number(t.COMPLETED_COUNT || 0);
        const total = pending + completed;
        return { ...t, pending, completed, total, pct: total ? (completed / total) * 100 : 0 };
      }),
    [trainings]
  );

  const totals = useMemo(() => {
    const pending = rows.reduce((s, r) => s + r.pending, 0);
    const completed = rows.reduce((s, r) => s + r.completed, 0);
    const total = pending + completed;
    return { pending, completed, rate: total ? Math.round((completed / total) * 100) : 0 };
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter === "open" && r.pending === 0) return false;
      if (filter === "done" && r.pending > 0) return false;
      if (!q) return true;
      return (
        String(r.TRAINING_NAME).toLowerCase().includes(q) ||
        String(r.TRAINER_NAME || "").toLowerCase().includes(q) ||
        String(r.TRAINER_EMPLOYEE_NO).toLowerCase().includes(q)
      );
    });
  }, [rows, query, filter]);

  const plant = authService.getPlantName();

  return (
    <AdminLayout
      title="Trainings"
      subtitle={plant ? `Feedback progress across ${plant}.` : "Feedback progress for your plant."}
      actions={
        <Button icon={Plus} onClick={() => navigate("/admin/trainings/new")}>
          Assign training
        </Button>
      }
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard icon={GraduationCap} label="Trainings" value={loading ? "–" : rows.length} />
        <StatCard icon={Clock} label="Pending responses" value={loading ? "–" : totals.pending} tone="amber" />
        <StatCard icon={CheckCircle2} label="Completed" value={loading ? "–" : totals.completed} tone="green" />
        <StatCard icon={Users} label="Completion rate" value={loading ? "–" : `${totals.rate}%`} tone="slate" />
      </div>

      {/* Toolbar */}
      <div className="mt-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative md:w-80">
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search training or trainer"
            aria-label="Search trainings"
            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-base placeholder:text-slate-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 md:h-11 md:text-sm"
          />
        </div>

        <div className="inline-flex self-start rounded-xl bg-slate-100 p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`h-9 rounded-lg px-4 text-sm font-medium transition ${
                filter === f.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="mt-5">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-44 rounded-2xl" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No trainings yet"
            text="Assign a training to your employees and their feedback will be tracked here."
            action={
              <Button icon={Plus} onClick={() => navigate("/admin/trainings/new")}>
                Assign your first training
              </Button>
            }
          />
        ) : visible.length === 0 ? (
          <EmptyState icon={Search} title="Nothing matches" text="Try a different search or filter." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((t) => (
              <button
                key={t.TRAINING_ID}
                onClick={() => navigate(`/admin/trainings/${t.TRAINING_ID}`)}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-card transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="line-clamp-2 text-base font-semibold leading-snug text-slate-900">{t.TRAINING_NAME}</h2>
                  <ChevronRight size={18} className="mt-0.5 shrink-0 text-slate-300 transition group-hover:text-brand-600" />
                </div>

                <div className="mt-3 space-y-1.5 text-sm text-slate-500">
                  <p className="flex items-center gap-2">
                    <UserRound size={14} className="shrink-0" />
                    <span className="truncate">
                      {t.TRAINER_NAME || t.TRAINER_EMPLOYEE_NO}
                      {t.TRAINER_NAME && <span className="text-slate-400"> · {t.TRAINER_EMPLOYEE_NO}</span>}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays size={14} className="shrink-0" />
                    {formatDate(t.CREATED_AT)}
                  </p>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">
                      {t.completed} of {t.total} completed
                    </span>
                    <StatusBadge status={t.pending === 0 && t.total > 0 ? "completed" : "progress"} />
                  </div>
                  <ProgressBar value={t.pct} />
                  {t.pending > 0 && (
                    <p className="mt-2 text-xs text-amber-700">{t.pending} pending</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
