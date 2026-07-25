import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import adminApi from "../services/adminApi";

function useFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);

  const [totalFeedbacks, setTotalFeedbacks] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);

  const [limit] = useState(10);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");

  const fetchFeedbacks = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);

        const data = await adminApi.getAllFeedbacks(page, limit);

        setFeedbacks(data.feedbacks || []);

        setTotalFeedbacks(data.totalFeedbacks || 0);

        setTotalPages(data.totalPages || 1);

        setCurrentPage(data.currentPage || 1);
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.message || "Failed to fetch feedbacks.",
        );
      } finally {
        setLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    fetchFeedbacks(currentPage);
  }, [fetchFeedbacks, currentPage]);

  // Department list
  const departments = useMemo(() => {
    return [
      "All Departments",
      ...new Set(
        feedbacks
          .map((feedback) => feedback.department)
          .filter(Boolean)
          .sort(),
      ),
    ];
  }, [feedbacks]);

  // Frontend filtering for current page
  const filteredFeedbacks = useMemo(() => {
    let filtered = [...feedbacks];

    if (selectedDepartment !== "All Departments") {
      filtered = filtered.filter(
        (feedback) => feedback.department === selectedDepartment,
      );
    }

    const keyword = searchTerm.trim().toLowerCase();

    if (keyword) {
      filtered = filtered.filter(
        (feedback) =>
          feedback.participantName?.toLowerCase().includes(keyword) ||
          feedback.employeeNo?.toLowerCase().includes(keyword) ||
          feedback.department?.toLowerCase().includes(keyword) ||
          feedback.course?.toLowerCase().includes(keyword),
      );
    }

    return filtered;
  }, [feedbacks, searchTerm, selectedDepartment]);

  return {
    feedbacks: filteredFeedbacks,

    totalFeedbacks,

    loading,

    refreshFeedbacks: () => fetchFeedbacks(currentPage),

    searchTerm,
    setSearchTerm,

    departments,

    selectedDepartment,
    setSelectedDepartment,

    currentPage,

    totalPages,

    goToPage: setCurrentPage,
  };
}

export default useFeedbacks;
