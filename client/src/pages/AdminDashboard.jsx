import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";

import AdminNavbar from "../components/admin/AdminNavbar";
import SearchFilterBar from "../components/admin/SearchFilterBar";
import FeedbackTable from "../components/admin/FeedbackTable";
import Pagination from "../components/admin/Pagination";

function AdminDashboard() {
  const [reports, setReports] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  // Dropdown Data

  const [departments, setDepartments] = useState([]);

  const [courses, setCourses] = useState([]);

  const totalPages = 1;

  const fetchReports = useCallback(async (filters = {}) => {
    try {
      const response = await api.get("/feedback", {
        params: filters,
      });

      const data = response.data;

      if (data.success) {
        const feedbackData = data.data || [];

        setReports(feedbackData);

        // Extract Departments

        const uniqueDepartments = [
          ...new Set(
            feedbackData

              .map((item) => item.department)

              .filter(Boolean),
          ),
        ];

        setDepartments(uniqueDepartments);

        // Extract Courses

        const uniqueCourses = [
          ...new Set(
            feedbackData

              .map((item) => item.course)

              .filter(Boolean),
          ),
        ];

        setCourses(uniqueCourses);
      }
    } catch (error) {
      console.log(
        "Feedback API Error:",

        error.response?.data || error.message,
      );

      toast.error("Unable to fetch reports");
    }
  }, []);

  useEffect(() => {
    const loadReports = async () => {
      await fetchReports();
    };

    loadReports();
  }, [fetchReports]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main
        className="
        p-4
        sm:p-6
        lg:p-8
        "
      >
        <SearchFilterBar
          onSearch={fetchReports}

          departments={departments}

          courses={courses}
        />

        <FeedbackTable reports={reports} />

        <Pagination
          currentPage={currentPage}

          totalPages={totalPages}

          onPageChange={setCurrentPage}
        />
      </main>
    </div>
  );
}

export default AdminDashboard;
