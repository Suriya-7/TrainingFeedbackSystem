import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Users, LogOut, GraduationCap } from "lucide-react";
import { toast } from "react-toastify";

import { getTrainings } from "../services/trainingApi";

function AdminDashboard() {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTrainings()
      .then((res) => setTrainings(res.data))
      .catch(() => toast.error("Could not load trainings."))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Trainings</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/trainings/new")}
              className="flex items-center gap-1.5 bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-black transition"
            >
              <Plus size={16} /> Assign Training
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500 text-center py-10">Loading...</p>
        ) : trainings.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <GraduationCap size={26} className="text-gray-400" />
            </div>
            <p className="font-semibold text-gray-900">No current training</p>
            <p className="text-sm text-gray-500 mt-1">Assign one to get started.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {trainings.map((t) => (
              <button
                key={t.TRAINING_ID}
                onClick={() => navigate(`/admin/trainings/${t.TRAINING_ID}`)}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 text-left hover:border-gray-400 transition"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">{t.TRAINING_NAME}</h2>
                  <span className="text-xs text-gray-400">
                    Trainer: {t.TRAINER_EMPLOYEE_NO}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-amber-600">
                    <Users size={14} /> {t.PENDING_COUNT || 0} pending
                  </span>
                  <span className="flex items-center gap-1.5 text-green-600">
                    <Users size={14} /> {t.COMPLETED_COUNT || 0} completed
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
