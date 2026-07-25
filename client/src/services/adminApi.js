import api from "./api";

const adminApi = {

  // Get feedbacks with pagination
  getAllFeedbacks: async (page = 1, limit = 10) => {

    const response = await api.get(
      `/admin/feedbacks?page=${page}&limit=${limit}`
    );

    return response.data;
  },


  // Get single feedback
  getFeedbackById: async (id) => {

    const response = await api.get(
      `/admin/feedbacks/${id}`
    );

    return response.data;
  },


  // Delete feedback
  deleteFeedback: async (id) => {

    const response = await api.delete(
      `/admin/feedbacks/${id}`
    );

    return response.data;
  },

  // Download PDF
downloadPDF: async (id) => {

  const response = await api.get(
    `/admin/feedbacks/${id}/pdf`,
    {
      responseType: "blob",
    }
  );

  return response;
},

};

export default adminApi;