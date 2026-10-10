import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Check } from "lucide-react";
import { toast } from "react-toastify";

import {
  getTrainingTypes,
  createTrainingType,
  getAssignableEmployees,
  createTraining,
} from "../services/trainingApi";

function AdminCreateTraining() {
  const navigate = useNavigate();

  const [types, setTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [trainingTypeId, setTrainingTypeId] = useState("");
  const [newTypeName, setNewTypeName] = useState("");
  const [showNewType, setShowNewType] = useState(false);
  const [trainerEmployeeNo, setTrainerEmployeeNo] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState(new Set());

  useEffect(() => {
    Promise.all([getTrainingTypes(), getAssignableEmployees()])
      .then(([typesRes, empRes]) => {
        setTypes(typesRes.data);
        setEmployees(empRes.data);
      })
      .catch(() => toast.error("Could not load setup data."))
      .finally(() => setLoading(false));
  }, []);

  const handleAddType = async () => {
    if (!newTypeName.trim()) return;
    try {
      const res = await createTrainingType(newTypeName.trim());
      const newId = res.data;
      setTypes((prev) => [...prev, { TRAINING_TYPE_ID: newId, TRAINING_NAME: newTypeName.trim() }]);
      setTrainingTypeId(String(newId));
      setNewTypeName("");
      setShowNewType(false);
      toast.success("Training type added.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add training type.");
    }
  };

  const toggleEmployee = (employeeNo) => {
    setSelectedEmployees((prev) => {
      const next = new Set(prev);
      next.has(employeeNo) ? next.delete(employeeNo) : next.add(employeeNo);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trainingTypeId || !trainerEmployeeNo || selectedEmployees.size === 0) {
      toast.error("Pick a training type, a trainer, and at least one employee.");
      return;
    }

    try {
      setSubmitting(true);
      await createTraining({
        trainingTypeId: Number(trainingTypeId),
        trainerEmployeeNo,
        employeeNos: Array.from(selectedEmployees),
      });
      toast.success("Training assigned.");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not assign training.");
    } finally {
      setSubmitting(false);
    }
  };

  const assignableList = employees.filter((e) => e.employeeNo !== trainerEmployeeNo);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 space-y-6"
        >
          <h1 className="text-lg font-bold text-gray-900">Assign New Training</h1>

          {/* Training type */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Training</label>
            <select
              value={trainingTypeId}
              onChange={(e) => setTrainingTypeId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Select training...</option>
              {types.map((t) => (
                <option key={t.TRAINING_TYPE_ID} value={t.TRAINING_TYPE_ID}>
                  {t.TRAINING_NAME}
                </option>
              ))}
            </select>

            {showNewType ? (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="New training name"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
                <button
                  type="button"
                  onClick={handleAddType}
                  className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowNewType(true)}
                className="mt-2 flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <Plus size={14} /> Add a new training
              </button>
            )}
          </div>

          {/* Trainer */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Trainer</label>
            <select
              value={trainerEmployeeNo}
              onChange={(e) => setTrainerEmployeeNo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Select trainer...</option>
              {employees.map((e) => (
                <option key={e.employeeNo} value={e.employeeNo}>
                  {e.fullName} ({e.employeeNo})
                </option>
              ))}
            </select>
          </div>

          {/* Employee checklist */}
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">
              Employees to assign ({selectedEmployees.size} selected)
            </label>
            <div className="border border-gray-200 rounded-xl max-h-64 overflow-y-auto divide-y divide-gray-100">
              {assignableList.map((emp) => (
                <label
                  key={emp.employeeNo}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer"
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      selectedEmployees.has(emp.employeeNo)
                        ? "bg-gray-900 border-gray-900"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedEmployees.has(emp.employeeNo) && <Check size={13} className="text-white" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedEmployees.has(emp.employeeNo)}
                    onChange={() => toggleEmployee(emp.employeeNo)}
                  />
                  <span className="text-sm text-gray-900">
                    {emp.fullName} <span className="text-gray-400">· {emp.department}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition disabled:opacity-50"
          >
            {submitting ? "Assigning..." : "Assign Training"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminCreateTraining;
