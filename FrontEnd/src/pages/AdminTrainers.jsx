import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserPlus, UserMinus, Check, UserCog, Download } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import AdminLayout from "../components/layout/AdminLayout";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import PlantTag from "../components/ui/PlantTag";
import { Skeleton } from "../components/ui/Skeleton";
import {
  getTrainers,
  searchEmployeesForTrainer,
  addTrainer,
  removeTrainer,
  importTrainers,
} from "../services/trainerApi";
import { initials, plantLabel, PLANTS } from "../utils/format";

const errorText = (err, fallback) => err.response?.data?.message || fallback;

function PlantChips({ value, onChange }) {
  const items = [{ key: "", label: "All plants" }, ...PLANTS.map((p) => ({ key: p, label: plantLabel(p) }))];
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((i) => (
        <button
          key={i.key || "all"}
          type="button"
          onClick={() => onChange(i.key)}
          className={`h-8 rounded-full px-3 text-xs font-semibold transition ${
            value === i.key ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {i.label}
        </button>
      ))}
    </div>
  );
}

function SearchBox({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-11 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-base placeholder:text-slate-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 md:text-sm"
      />
    </div>
  );
}

function Avatar({ name, tone = "brand" }) {
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
        tone === "brand" ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-600"
      }`}
    >
      {initials(name)}
    </span>
  );
}

function AdminTrainers() {
  const [tab, setTab] = useState("list"); // phones/tablets only: "list" | "add"

  // ---- current trainers ----
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listQuery, setListQuery] = useState("");
  const [listPlant, setListPlant] = useState("");
  const [removing, setRemoving] = useState(null);
  const [importing, setImporting] = useState(false);

  // ---- add trainer picker ----
  const [query, setQuery] = useState("");
  const [plant, setPlant] = useState("");
  const [results, setResults] = useState({ data: [], total: 0 });
  const [searching, setSearching] = useState(true);
  const [adding, setAdding] = useState(null);

  const loadTrainers = useCallback(() => {
    return getTrainers()
      .then((res) => setTrainers(res.data))
      .catch((err) => toast.error(errorText(err, "Could not load trainers.")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadTrainers();
  }, [loadTrainers]);

  // Search all employees (debounced). The server returns at most 50 per search.
  useEffect(() => {
    setSearching(true);
    const t = setTimeout(() => {
      searchEmployeesForTrainer({ q: query, plant })
        .then((res) => setResults({ data: res.data, total: res.total }))
        .catch((err) => toast.error(errorText(err, "Could not search employees.")))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query, plant]);

  const shownTrainers = useMemo(() => {
    const q = listQuery.trim().toLowerCase();
    return trainers
      .filter((t) => (listPlant ? t.plantCode === listPlant : true))
      .filter(
        (t) =>
          !q ||
          String(t.fullName || "").toLowerCase().includes(q) ||
          String(t.employeeNo).toLowerCase().includes(q) ||
          String(t.department || "").toLowerCase().includes(q)
      )
      .sort((a, b) => String(a.fullName || a.employeeNo).localeCompare(String(b.fullName || b.employeeNo)));
  }, [trainers, listQuery, listPlant]);

  const handleAdd = async (emp) => {
    try {
      setAdding(emp.employeeNo);
      await addTrainer(emp.employeeNo);
      setResults((prev) => ({
        ...prev,
        data: prev.data.map((e) => (e.employeeNo === emp.employeeNo ? { ...e, isTrainer: true } : e)),
      }));
      await loadTrainers();
      toast.success(`${emp.fullName} is now a trainer.`);
    } catch (err) {
      toast.error(errorText(err, "Could not add trainer."));
    } finally {
      setAdding(null);
    }
  };

  const handleRemove = async (t) => {
    const name = t.fullName || t.employeeNo;
    const confirm = await Swal.fire({
      title: `Remove ${name}?`,
      text: "They will no longer appear in the trainer list. Trainings already assigned are not affected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Remove",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      customClass: { popup: "!rounded-3xl" },
    });
    if (!confirm.isConfirmed) return;

    try {
      setRemoving(t.employeeNo);
      await removeTrainer(t.employeeNo);
      setTrainers((prev) => prev.filter((x) => x.employeeNo !== t.employeeNo));
      setResults((prev) => ({
        ...prev,
        data: prev.data.map((e) => (e.employeeNo === t.employeeNo ? { ...e, isTrainer: false } : e)),
      }));
      toast.success(`${name} removed from trainers.`);
    } catch (err) {
      toast.error(errorText(err, "Could not remove trainer."));
    } finally {
      setRemoving(null);
    }
  };

  const handleImport = async () => {
    try {
      setImporting(true);
      const res = await importTrainers();
      toast.success(res.added ? `${res.added} trainer(s) imported.` : "No new trainers to import.");
      await loadTrainers();
    } catch (err) {
      toast.error(errorText(err, "Could not import trainers."));
    } finally {
      setImporting(false);
    }
  };

  return (
    <AdminLayout
      title="Trainers"
      subtitle="One shared list for all three plants. Anyone here can be picked as a trainer when assigning a training."
      width="max-w-6xl"
    >
      {/* Phones & tablets: switch between the two panels */}
      <div className="mb-5 inline-flex rounded-xl bg-slate-100 p-1 lg:hidden">
        {[
          { key: "list", label: `Trainers (${trainers.length})` },
          { key: "add", label: "Add trainer" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`h-10 rounded-lg px-5 text-sm font-medium transition ${
              tab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-2 lg:items-start">
        {/* ---------------- Current trainers ---------------- */}
        <section className={`${tab === "list" ? "" : "hidden"} rounded-2xl border border-slate-200 bg-white shadow-card lg:block`}>
          <div className="space-y-3 p-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Current trainers</h2>
              <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
                {trainers.length}
              </span>
            </div>
            <SearchBox value={listQuery} onChange={setListQuery} placeholder="Search trainers" />
            <PlantChips value={listPlant} onChange={setListPlant} />
          </div>

          <div className="border-t border-slate-100">
            {loading ? (
              <div className="space-y-3 p-5">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            ) : trainers.length === 0 ? (
              <div className="p-5 sm:p-6">
                <EmptyState
                  icon={UserCog}
                  title="No trainers yet"
                  text="Add trainers from the employee list, or import the ones already flagged in the employee system."
                  action={
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button variant="secondary" icon={Download} loading={importing} onClick={handleImport}>
                        Import existing trainers
                      </Button>
                      <Button icon={UserPlus} className="lg:hidden" onClick={() => setTab("add")}>
                        Add trainer
                      </Button>
                    </div>
                  }
                />
              </div>
            ) : shownTrainers.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-slate-500">No trainers match.</p>
            ) : (
              <ul className="max-h-[34rem] divide-y divide-slate-100 overflow-y-auto">
                {shownTrainers.map((t) => (
                  <li key={t.employeeNo} className="flex items-center gap-3.5 px-5 py-3 sm:px-6">
                    <Avatar name={t.fullName || t.employeeNo} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">{t.fullName || t.employeeNo}</p>
                      <p className="truncate text-xs text-slate-500">
                        {t.employeeNo}
                        {t.department && ` · ${t.department}`}
                      </p>
                    </div>
                    <PlantTag code={t.plantCode} />
                    <Button
                      size="sm"
                      variant="ghost"
                      icon={UserMinus}
                      loading={removing === t.employeeNo}
                      onClick={() => handleRemove(t)}
                      className="!text-red-600 hover:!bg-red-50"
                      aria-label={`Remove ${t.fullName || t.employeeNo}`}
                    >
                      <span className="hidden sm:inline">Remove</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ---------------- Add trainer ---------------- */}
        <section className={`${tab === "add" ? "" : "hidden"} rounded-2xl border border-slate-200 bg-white shadow-card lg:block`}>
          <div className="space-y-3 p-5 pb-4 sm:p-6 sm:pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Add a trainer</h2>
              <p className="mt-0.5 text-xs text-slate-500">Employees of every plant are listed here.</p>
            </div>
            <SearchBox value={query} onChange={setQuery} placeholder="Search by name, number or department" />
            <PlantChips value={plant} onChange={setPlant} />
          </div>

          <div className="border-t border-slate-100">
            {searching && results.data.length === 0 ? (
              <div className="space-y-3 p-5">
                {[0, 1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            ) : results.data.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-slate-500">No employees match.</p>
            ) : (
              <>
                <ul className={`max-h-[34rem] divide-y divide-slate-100 overflow-y-auto transition ${searching ? "opacity-60" : ""}`}>
                  {results.data.map((e) => (
                    <li key={e.employeeNo} className="flex items-center gap-3.5 px-5 py-3 sm:px-6">
                      <Avatar name={e.fullName} tone="slate" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">{e.fullName}</p>
                        <p className="truncate text-xs text-slate-500">
                          {e.employeeNo} · {e.department}
                        </p>
                      </div>
                      <PlantTag code={e.plantCode} />
                      {e.isTrainer ? (
                        <span className="inline-flex h-9 items-center gap-1 rounded-lg bg-emerald-50 px-2.5 text-xs font-semibold text-emerald-700">
                          <Check size={14} /> Trainer
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={UserPlus}
                          loading={adding === e.employeeNo}
                          onClick={() => handleAdd(e)}
                        >
                          Add
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
                {results.total > results.data.length && (
                  <p className="border-t border-slate-100 px-6 py-3 text-center text-xs text-slate-500">
                    Showing {results.data.length} of {results.total} — type a name or number to narrow it down.
                  </p>
                )}
              </>
            )}
          </div>
        </section>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Ready to use them? <Link to="/admin/trainings/new" className="font-medium text-brand-700 hover:text-brand-900">Assign a training →</Link>
      </p>
    </AdminLayout>
  );
}

export default AdminTrainers;
