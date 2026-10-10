import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, ChevronRight, Inbox, LogOut } from "lucide-react";
import { toast } from "react-toastify";

import { getPendingFeedback } from "../services/employeeApi";

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

  const handleLogout = () => {
    localStorage.removeItem("employeeToken");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Your Trainings</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6">
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-10">Loading...</p>
          ) : pending.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <Inbox size={26} className="text-gray-400" />
              </div>
              <p className="font-semibold text-gray-900">No training assigned right now</p>
              <p className="text-sm text-gray-500 mt-1">Check back later.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {pending.map((item) => (
                <li key={item.RECORD_ID}>
                  <button
                    onClick={() => navigate(`/employee/feedback/${item.RECORD_ID}`)}
                    className="w-full flex items-center justify-between py-4 text-left hover:bg-gray-50 -mx-2 px-2 rounded-xl transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shrink-0">
                        <ClipboardList size={18} />
                      </div>
                      <span className="font-medium text-gray-900">{item.COURSE_NAME}</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
