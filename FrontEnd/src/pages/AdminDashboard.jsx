import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import AdminNavbar from "../components/admin/AdminNavbar";
import SearchFilterBar from "../components/admin/SearchFilterBar";
import FeedbackTable from "../components/admin/FeedbackTable";
import Pagination from "../components/admin/Pagination";
import FeedbackModal from "../components/admin/FeedbackModal";

import useFeedbacks from "../hooks/useFeedbacks";
import adminApi from "../services/adminApi";

function AdminDashboard() {
  const {
    feedbacks,
    totalFeedbacks,
    loading,
    refreshFeedbacks,

    searchTerm,
    setSearchTerm,

    departments,
    selectedDepartment,
    setSelectedDepartment,

    currentPage,
    totalPages,
    goToPage,
  } = useFeedbacks();

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

  // ==========================
  // Delete Feedback
  // ==========================

  const handleDelete = async (feedback) => {
    const result = await Swal.fire({
      title: "Delete Feedback?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await adminApi.deleteFeedback(feedback._id);

      await Swal.fire({
        title: "Deleted!",
        text: "Feedback deleted successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      refreshFeedbacks();
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Failed to delete feedback.",
        icon: "error",
      });
    }
  };

  // ==========================
  // Download PDF
  // ==========================

  const handleDownload = async (id) => {
    try {
      setDownloadingId(id);

      Swal.fire({
        title: "Preparing PDF",
        text: "Please wait while your PDF is being generated...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await adminApi.downloadPDF(id);

      Swal.close();

      let fileName = "Feedback.pdf";

      const disposition = response.headers["content-disposition"];

      if (disposition) {
        const match = disposition.match(/filename="?([^"]+)"?/);

        if (match && match[1]) {
          fileName = match[1];
        }
      }

      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("PDF downloaded successfully.");
    } catch (error) {
      console.error(error);

      Swal.close();

      toast.error(
        error.response?.data?.message || "Failed to download PDF."
      );
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}

      <AdminNavbar
        totalFeedbacks={totalFeedbacks}
        onRefresh={refreshFeedbacks}
        loading={loading}
      />

      {/* Main Content */}

      <main
        className="
          max-w-7xl
          mx-auto
          px-4
          md:px-6
          py-6
        "
      >
        {/* Search + Filter */}

        <SearchFilterBar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          departments={departments}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
        />

        {/* Feedback Table */}

        <FeedbackTable
          feedbacks={feedbacks}
          loading={loading}
          downloadingId={downloadingId}
          onView={(feedback) => {
            setSelectedFeedback(feedback);
          }}
          onDelete={handleDelete}
          onDownload={handleDownload}
        />

        {/* Pagination */}

        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        )}
      </main>

      {/* Feedback Details Modal */}

      {selectedFeedback && (
        <FeedbackModal
          feedback={selectedFeedback}
          onClose={() => {
            setSelectedFeedback(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminDashboard;