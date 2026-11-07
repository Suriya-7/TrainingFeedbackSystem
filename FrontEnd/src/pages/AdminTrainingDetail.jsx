import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, FileDown, Search, Users, CheckCircle2, Clock, UserRound, CalendarDays } from "lucide-react";
import { toast } from "react-toastify";

import AdminLayout from "../components/layout/AdminLayout";
import Button from "../components/ui/Button";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import ProgressBar from "../components/ui/ProgressBar";
import EmptyState from "../components/ui/EmptyState";
import { Skeleton } from "../components/ui/Skeleton";
import { getTrainingDetail, downloadTrainingZip, downloadFeedbackPdf } from "../services/trainingApi";
import { saveBlob, filenameFromResponse, blobErrorMessage } from "../utils/download";
import { formatDate, formatDateTime, initials } from "../utils/format";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "COMPLETED", label: "Completed" },
  { key: "PENDING", label: "Pending" },
];

function AdminTrainingDetail() {
  const { id } = useParams();

  const [rows, setRows] = useState([]);
  const [training, setTraining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zipping, setZipping] = useState(false);
  const [busyRow, setBusyRow] = useState(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getTrainingDetail(id)
      .then((res) => {
        setRows(res.data);
        setTraining(res.training || null);
      })
      .catch(() => toast.error("Could not load this training."))
      .finally(() => setLoading(false));
  }, [id]);

  const completedCount = rows.filter((r) => r.STATUS === "COMPLETED").length;
  const pendingCount = rows.length - completedCount;
  const pct = rows.length ? (completedCount / rows.length) * 100 : 0;

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.STATUS !== filter) return false;
      if (!q) return true;
      return (
        String(r.PARTICIPANT_NAME).toLowerCase().includes(q) ||
        String(r.EMPLOYEE_NO).toLowerCase().includes(q) ||
        String(r.DEPARTMENT).toLowerCase().includes(q)
      );
    });
  }, [rows, query, filter]);

  const handleZip = async () => {
    try {
      setZipping(true);
      const res = await downloadTrainingZip(id);
      saveBlob(new Blob([res.data], { type: "application/zip" }), filenameFromResponse(res, `training-${id}-feedback.zip`));
      toast.success("Download started.");
    } catch (err) {
      // The server's real reason (e.g. "No Chrome or Edge was found…") is inside the blob.
      toast.error(await blobErrorMessage(err, "Could not download the PDFs."));
    } finally {
      setZipping(false);
    }
  };

  const handleOnePdf = async (row) => {
    try {
      setBusyRow(row.RECORD_ID);
      const res = await downloadFeedbackPdf(id, row.RECORD_ID);
      saveBlob(new Blob([res.data], { type: "application/pdf" }), filenameFromResponse(res, `${row.EMPLOYEE_NO}.pdf`));
    } catch (err) {
      toast.error(await blobErrorMessage(err, "Could not download this PDF."));
    } finally {
      setBusyRow(null);
    }
  };

  const title = training?.TRAINING_NAME || "Training";

  return (
    <AdminLayout
      back={{ to: "/admin/dashboard", label: "All trainings" }}
      title={loading ? "Loading…" : title}
      subtitle={
        training && (
          <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <UserRound size={14} />
              Trainer: {training.TRAINER_NAME || training.TRAINER_EMPLOYEE_NO}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} />
              {formatDate(training.CREATED_AT)}
            </span>
          </span>
        )
      }
      actions={
        <Button
          icon={Download}
          loading={zipping}
          disabled={loading || completedCount === 0}
          onClick={handleZip}
          title={completedCount === 0 ? "No completed feedback yet" : "Download every completed form as a ZIP of PDFs"}
        >
          {zipping ? "Preparing PDFs…" : `Download all PDFs (${completedCount})`}
        </Button>
      }
    >
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <StatCard icon={Users} label="Assigned" value={rows.length} />
            <StatCard icon={CheckCircle2} label="Completed" value={completedCount} tone="green" />
            <StatCard icon={Clock} label="Pending" value={pendingCount} tone="amber" />
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Feedback received</span>
              <span className="font-semibold text-slate-900">{Math.round(pct)}%</span>
            </div>
            <ProgressBar value={pct} />
          </div>

          {/* Toolbar */}
          <div className="mt-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative md:w-80">
              <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, number or department"
                aria-label="Search employees"
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

          {/* Employees */}
          <div className="mt-5">
            {visible.length === 0 ? (
              <EmptyState icon={Users} title="No employees to show" text="Try a different search or filter." />
            ) : (
              <>
                {/* Table: tablets & up */}
                <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card md:block">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-5 py-3">Employee</th>
                        <th className="px-5 py-3">Department</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="hidden px-5 py-3 lg:table-cell">Submitted</th>
                        <th className="px-5 py-3 text-right">PDF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {visible.map((r) => (
                        <tr key={r.RECORD_ID} className="transition hover:bg-slate-50/70">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                                {initials(r.PARTICIPANT_NAME)}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-slate-900">{r.PARTICIPANT_NAME}</p>
                                <p className="text-xs text-slate-500">{r.EMPLOYEE_NO}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">{r.DEPARTMENT}</td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={r.STATUS === "COMPLETED" ? "completed" : "pending"} />
                          </td>
                          <td className="hidden px-5 py-3.5 text-slate-500 lg:table-cell">
                            {r.STATUS === "COMPLETED" ? formatDateTime(r.SUBMITTED_AT) : "—"}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {r.STATUS === "COMPLETED" ? (
                              <Button
                                size="sm"
                                variant="secondary"
                                icon={FileDown}
                                loading={busyRow === r.RECORD_ID}
                                onClick={() => handleOnePdf(r)}
                              >
                                PDF
                              </Button>
                            ) : (
                              <span className="text-slate-300">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Cards: phones */}
                <ul className="space-y-3 md:hidden">
                  {visible.map((r) => (
                    <li key={r.RECORD_ID} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                          {initials(r.PARTICIPANT_NAME)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-slate-900">{r.PARTICIPANT_NAME}</p>
                          <p className="truncate text-xs text-slate-500">
                            {r.EMPLOYEE_NO} · {r.DEPARTMENT}
                          </p>
                        </div>
                        <StatusBadge status={r.STATUS === "COMPLETED" ? "completed" : "pending"} />
                      </div>
                      {r.STATUS === "COMPLETED" && (
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                          <span className="text-xs text-slate-500">{formatDateTime(r.SUBMITTED_AT)}</span>
                          <Button
                            size="sm"
                            variant="secondary"
                            icon={FileDown}
                            loading={busyRow === r.RECORD_ID}
                            onClick={() => handleOnePdf(r)}
                          >
                            PDF
                          </Button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminTrainingDetail;
