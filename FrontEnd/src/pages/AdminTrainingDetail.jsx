import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, CheckCircle2, Clock } from "lucide-react";
import { toast } from "react-toastify";

import { getTrainingDetail, downloadTrainingZip } from "../services/trainingApi";

function AdminTrainingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    getTrainingDetail(id)
      .then((res) => setRows(res.data))
      .catch(() => toast.error("Could not load this training."))
      .finally(() => setLoading(false));
  }, [id]);

  const completedCount = rows.filter((r) => r.STATUS === "COMPLETED").length;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const res = await downloadTrainingZip(id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `training-${id}-feedback.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error("Nothing to download yet, or something went wrong.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">Assigned Employees</h1>
            <button
              onClick={handleDownload}
              disabled={downloading || completedCount === 0}
              className="flex items-center gap-1.5 bg-gray-900 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-black transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download size={16} /> {downloading ? "Preparing..." : `Download (${completedCount})`}
            </button>
          </div>

          <ul className="divide-y divide-gray-100">
            {rows.map((r) => (
              <li key={r.RECORD_ID} className="flex items-center justify-between px-6 py-3.5">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{r.PARTICIPANT_NAME}</p>
                  <p className="text-xs text-gray-400">
                    {r.EMPLOYEE_NO} · {r.DEPARTMENT}
                  </p>
                </div>
                {r.STATUS === "COMPLETED" ? (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                    <CheckCircle2 size={13} /> Completed
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    <Clock size={13} /> Pending
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminTrainingDetail;
