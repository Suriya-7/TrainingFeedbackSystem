import AdminNavbar from "../components/admin/AdminNavbar";
import SearchFilterBar from "../components/admin/SearchFilterBar";
import FeedbackTable from "../components/admin/FeedbackTable";
import Pagination from "../components/admin/Pagination";
import useFeedbacks from "../hooks/useFeedbacks";

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

  return (
    <div className="min-h-screen bg-gray-100">

      <AdminNavbar
        totalFeedbacks={totalFeedbacks}
        onRefresh={refreshFeedbacks}
        loading={loading}
      />

      <div className="max-w-7xl mx-auto px-6 py-6">

        <SearchFilterBar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          departments={departments}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
        />

        <FeedbackTable
          feedbacks={feedbacks}
          loading={loading}
          onView={(feedback) => console.log("View:", feedback)}
          onDelete={(feedback) => console.log("Delete:", feedback)}
          onDownload={(feedback) => console.log("Download:", feedback)}
        />


        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
/>
      </div>

    </div>
  );
}

export default AdminDashboard;