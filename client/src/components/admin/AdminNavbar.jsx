import {
  RotateCw,
  LogOut,
  Building2,
  Database,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import authService from "../../services/authService";

function AdminNavbar({
  totalFeedbacks = 0,
  onRefresh,
  loading = false,
}) {
    const feedbackCount = Number(totalFeedbacks) || 0;
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();

    toast.success("Logged out successfully.");

    navigate("/admin/login", {
      replace: true,
    });
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">

        <div className="min-h-16 py-3 flex flex-col lg:flex-row items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center">
              <Building2 size={22} />
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Training Feedback System
              </h1>

              <p className="text-sm text-gray-500">
                Dietech India Pvt. Ltd.
              </p>
            </div>

          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center justify-center gap-3">

            {/* Total Feedback */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl border border-gray-200 bg-gray-50">

              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <Database size={18} />
              </div>

              <div>
                <p className="text-xs uppercase text-gray-500 tracking-wide">
                  Total Feedback
                </p>

                <p className="text-lg font-bold text-gray-900">
                    {feedbackCount}
                </p>
              </div>

            </div>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={loading}
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-xl
                border
                border-gray-300
                hover:bg-gray-100
                transition
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              <RotateCw
                size={18}
                className={loading ? "animate-spin" : ""}
              />

              {loading ? "Refreshing..." : "Refresh"}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="
                flex
                items-center
                gap-2
                px-4
                py-2
                rounded-xl
                bg-red-600
                text-white
                hover:bg-red-700
                transition
              "
            >
              <LogOut size={18} />
              Logout
            </button>

          </div>

        </div>

      </div>
    </nav>
  );
}

export default AdminNavbar;