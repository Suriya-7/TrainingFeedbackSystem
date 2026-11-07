import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Check, Search, Send, X, Building2, EyeOff } from "lucide-react";
import { toast } from "react-toastify";

import AdminLayout from "../components/layout/AdminLayout";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import PlantTag from "../components/ui/PlantTag";
import { PageLoader } from "../components/ui/Skeleton";
import {
  getTrainingTypes,
  createTrainingType,
  getAssignableEmployees,
  getTrainerOptions,
  createTraining,
} from "../services/trainingApi";
import authService from "../services/authService";
import { initials, plantLabel, PLANTS } from "../utils/format";

function AdminCreateTraining() {
  const navigate = useNavigate();
  const ownPlant = authService.getPlantCode();
  const otherPlants = PLANTS.filter((p) => p !== ownPlant);

  const [types, setTypes] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [ownEmployees, setOwnEmployees] = useState([]);
  const [otherEmployees, setOtherEmployees] = useState([]);
  const [showOthers, setShowOthers] = useState(false);
  const [loadingOthers, setLoadingOthers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [trainingTypeId, setTrainingTypeId] = useState("");
  const [newTypeName, setNewTypeName] = useState("");
  const [showNewType, setShowNewType] = useState(false);
  const [addingType, setAddingType] = useState(false);
  const [trainerEmployeeNo, setTrainerEmployeeNo] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());

  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("all");
  const [plantFilter, setPlantFilter] = useState("all");

  useEffect(() => {
    Promise.all([getTrainingTypes(), getAssignableEmployees("own"), getTrainerOptions()])
      .then(([typesRes, empRes, trainerRes]) => {
        setTypes(typesRes.data);
        setOwnEmployees(empRes.data);
        setTrainers(trainerRes.data);
      })
      .catch(() => toast.error("Could not load setup data."))
      .finally(() => setLoading(false));
  }, []);

  const ownNos = useMemo(() => new Set(ownEmployees.map((e) => e.employeeNo)), [ownEmployees]);

  // "Add other plant employees to this training"
  const handleShowOthers = async () => {
    setShowOthers(true);
    setPlantFilter("all");
    if (otherEmployees.length > 0) return;
    try {
      setLoadingOthers(true);
      const res = await getAssignableEmployees("others");
      setOtherEmployees(res.data);
    } catch {
      toast.error("Could not load other plants' employees.");
      setShowOthers(false);
    } finally {
      setLoadingOthers(false);
    }
  };

  const handleHideOthers = () => {
    // Drop anyone picked from another plant so nothing hidden stays selected.
    let removed = 0;
    setSelectedEmployees((prev) => {
      const next = new Set();
      prev.forEach((no) => {
        if (ownNos.has(no)) next.add(no);
        else removed++;
      });
      return next;
    });
    setShowOthers(false);
    setPlantFilter("all");
    if (removed) toast.info("Other plants' employees were removed from this training.");
  };

  const handleAddType = async () => {
    if (!newTypeName.trim()) return;
    try {
      setAddingType(true);
      const res = await createTrainingType(newTypeName.trim());
      const newId = res.data;
      setTypes((prev) => [...prev, { TRAINING_TYPE_ID: newId, TRAINING_NAME: newTypeName.trim() }]);
      setTrainingTypeId(String(newId));
      setNewTypeName("");
      setShowNewType(false);
      toast.success("Training added.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add training type.");
    } finally {
      setAddingType(false);
    }
  };

  const toggleEmployee = (employeeNo) => {
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      if (next.has(employeeNo)) next.delete(employeeNo);
      else next.add(employeeNo);
      return next;
    });
  };

  // Everyone that can be ticked right now: own plant, plus other plants once the button is used.
  const pool = useMemo(
    () => (showOthers ? [...ownEmployees, ...otherEmployees] : ownEmployees).filter((e) => e.employeeNo !== trainerEmployeeNo),
    [ownEmployees, otherEmployees, showOthers, trainerEmployeeNo]
  );
  const departments = useMemo(
    () => [...new Set(pool.map((e) => e.department).filter(Boolean))].sort(),
    [pool]
  );
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pool.filter((e) => {
      if (plantFilter !== "all" && e.plantCode !== plantFilter) return false;
      if (dept !== "all" && e.department !== dept) return false;
      if (!q) return true;
      return e.fullName.toLowerCase().includes(q) || e.employeeNo.toLowerCase().includes(q);
    });
  }, [pool, search, dept, plantFilter]);

  // If the chosen trainer was ticked as a participant, drop them.
  useEffect(() => {
    if (!trainerEmployeeNo) return;
    setSelectedEmployees((prev) => {
      if (!prev.has(trainerEmployeeNo)) return prev;
      const next = new Set(prev);
      next.delete(trainerEmployeeNo);
      return next;
    });
  }, [trainerEmployeeNo]);

  const otherSelected = [...selectedEmployees].filter((no) => !ownNos.has(no)).length;
  const allShownSelected = shown.length > 0 && shown.every((e) => selectedEmployees.has(e.employeeNo));
  const toggleAllShown = () => {
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      if (allShownSelected) shown.forEach((e) => next.delete(e.employeeNo));
      else shown.forEach((e) => next.add(e.employeeNo));
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trainingTypeId || !trainerEmployeeNo || selectedEmployees.size === 0) {
      toast.error("Pick a training, a trainer, and at least one employee.");
      return;
    }

    try {
      setSubmitting(true);
      await createTraining({
        trainingTypeId: Number(trainingTypeId),
        trainerEmployeeNo,
        employeeNos: Array.from(selectedEmployees),
        includeOtherPlants: otherSelected > 0,
      });
      toast.success("Training assigned.");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not assign training.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Assign training">
        <PageLoader />
      </AdminLayout>
    );
  }

  const ready = trainingTypeId && trainerEmployeeNo && selectedEmployees.size > 0;

  return (
    <AdminLayout
      back={{ to: "/admin/dashboard", label: "All trainings" }}
      title="Assign training"
      subtitle="Choose the training and trainer, then pick who should give feedback."
    >
      <form onSubmit={handleSubmit} className="pb-24 lg:pb-0">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-start">
          {/* Step 1: details */}
          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">1</span>
              <h2 className="text-base font-bold text-slate-900">Training details</h2>
            </div>

            <div>
              <Select label="Training" value={trainingTypeId} onChange={(e) => setTrainingTypeId(e.target.value)}>
                <option value="">Select training…</option>
                {types.map((t) => (
                  <option key={t.TRAINING_TYPE_ID} value={t.TRAINING_TYPE_ID}>
                    {t.TRAINING_NAME}
                  </option>
                ))}
              </Select>

              {showNewType ? (
                <div className="mt-2.5 flex gap-2">
                  <input
                    type="text"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddType();
                      }
                    }}
                    placeholder="New training name"
                    autoFocus
                    className="h-11 min-w-0 flex-1 rounded-xl border border-slate-300 px-3.5 text-base transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 md:text-sm"
                  />
                  <Button onClick={handleAddType} loading={addingType}>
                    Add
                  </Button>
                  <Button variant="ghost" onClick={() => setShowNewType(false)} aria-label="Cancel" className="!px-3">
                    <X size={18} />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewType(true)}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-900"
                >
                  <Plus size={15} /> Add a new training
                </button>
              )}
            </div>

            <div>
              <Select label="Trainer" value={trainerEmployeeNo} onChange={(e) => setTrainerEmployeeNo(e.target.value)}>
                <option value="">{trainers.length ? "Select trainer…" : "No trainers yet"}</option>
                {trainers.map((t) => (
                  <option key={t.employeeNo} value={t.employeeNo}>
                    {t.fullName} ({t.employeeNo}) · {plantLabel(t.plantCode)}
                  </option>
                ))}
              </Select>
              <p className="mt-2 text-xs text-slate-500">
                Trainers from all plants are listed.{" "}
                <Link to="/admin/trainers" className="font-medium text-brand-700 hover:text-brand-900">
                  Add or remove trainers
                </Link>
              </p>
            </div>
          </section>

          {/* Step 2: participants */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-card">
            <div className="p-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">2</span>
                  <h2 className="text-base font-bold text-slate-900">Participants</h2>
                </div>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800">
                  {selectedEmployees.size} selected
                  {otherSelected > 0 && ` · ${otherSelected} other plant`}
                </span>
              </div>

              {/* Other plants: button / switch */}
              {showOthers ? (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-brand-50 px-3.5 py-2.5">
                  <p className="flex items-center gap-2 text-sm font-medium text-brand-900">
                    <Building2 size={16} />
                    Including {otherPlants.map(plantLabel).join(" & ")} employees
                  </p>
                  <button
                    type="button"
                    onClick={handleHideOthers}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-900"
                  >
                    <EyeOff size={15} /> Hide
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleShowOthers}
                  disabled={loadingOthers}
                  className="mt-4 flex w-full items-center gap-3 rounded-xl border border-dashed border-brand-300 bg-brand-50/50 px-4 py-3 text-left transition hover:border-brand-500 hover:bg-brand-50 disabled:opacity-60"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 shadow-card">
                    <Plus size={18} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-brand-900">
                      {loadingOthers ? "Loading…" : "Add other plant employees to this training"}
                    </span>
                    <span className="block text-xs text-slate-500">
                      Shows {otherPlants.map(plantLabel).join(" and ")} employees
                    </span>
                  </span>
                </button>
              )}

              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <div className="relative flex-1">
                  <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name or number"
                    aria-label="Search employees"
                    className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-4 text-base placeholder:text-slate-400 transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-100 md:text-sm"
                  />
                </div>
                <Select value={dept} onChange={(e) => setDept(e.target.value)} aria-label="Department" className="sm:w-48">
                  <option value="all">All departments</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Select>
              </div>

              {showOthers && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {[{ key: "all", label: "All" }, { key: ownPlant, label: `${plantLabel(ownPlant)} (yours)` }, ...otherPlants.map((p) => ({ key: p, label: plantLabel(p) }))].map((c) => (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setPlantFilter(c.key)}
                      className={`h-8 rounded-full px-3 text-xs font-semibold transition ${
                        plantFilter === c.key ? "bg-brand-700 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={toggleAllShown}
                disabled={shown.length === 0}
                className="mt-3 text-sm font-medium text-brand-700 hover:text-brand-900 disabled:text-slate-300"
              >
                {allShownSelected ? "Clear these" : `Select all ${shown.length}`}
              </button>
            </div>

            <ul className="max-h-[26rem] divide-y divide-slate-100 overflow-y-auto border-t border-slate-100">
              {loadingOthers && <li className="px-6 py-10 text-center text-sm text-slate-500">Loading other plants…</li>}
              {!loadingOthers && shown.length === 0 && (
                <li className="px-6 py-10 text-center text-sm text-slate-500">No employees match.</li>
              )}
              {shown.map((emp) => {
                const on = selectedEmployees.has(emp.employeeNo);
                const isOther = !ownNos.has(emp.employeeNo);
                return (
                  <li key={emp.employeeNo}>
                    <label
                      className={`flex min-h-[3.5rem] items-center gap-3.5 px-5 py-2.5 transition sm:px-6 ${
                        on ? "bg-brand-50/60" : "hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={on}
                        onChange={() => toggleEmployee(emp.employeeNo)}
                      />
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-500 ${
                          on ? "border-brand-700 bg-brand-700" : "border-slate-300 bg-white"
                        }`}
                      >
                        {on && <Check size={13} className="text-white" strokeWidth={3} />}
                      </span>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                        {initials(emp.fullName)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-slate-900">{emp.fullName}</span>
                        <span className="block truncate text-xs text-slate-500">
                          {emp.employeeNo} · {emp.department}
                        </span>
                      </span>
                      {isOther && <PlantTag code={emp.plantCode} />}
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        {/* Action bar: sticks to the bottom on phones/tablets */}
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:static lg:mt-5 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 lg:justify-end">
            <p className="text-sm text-slate-500 lg:hidden">
              {selectedEmployees.size} participant{selectedEmployees.size === 1 ? "" : "s"}
            </p>
            <Button type="submit" size="lg" icon={Send} loading={submitting} disabled={!ready}>
              {submitting ? "Assigning…" : "Assign training"}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

export default AdminCreateTraining;
