import { RefreshCw, Database } from "lucide-react";

function DashboardHeader({
  totalFeedbacks = 0,
  onRefresh,
  loading = false,
}) {
  return (
    <div className="mb-6">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        {/* Left Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Manage all submitted training feedback records.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Total Count */}
          <div className="flex items-center gap-3 px-5 py-3 bg-gray-100 rounded-xl border border-gray-200">

            <div className="p-2 rounded-lg bg-black text-white">
              <Database size={20} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Total Feedback
              </p>

              <h2 className="text-2xl font-bold text-gray-900">
                {totalFeedbacks}
              </h2>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />

            {loading ? "Refreshing..." : "Refresh"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default DashboardHeader;