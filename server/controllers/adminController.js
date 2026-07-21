import Feedback from "../models/Feedback.js";
import generateToken from "../utils/generateToken.js";

/* ===========================
   ADMIN LOGIN
=========================== */
export const loginAdmin = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required.",
    });
  }

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = generateToken();

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid username or password.",
  });
};

/* ===========================
   GET ALL FEEDBACKS (PAGINATION)
=========================== */
export const getAllFeedbacks = async (req, res) => {
  try {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;


    const totalFeedbacks = await Feedback.countDocuments();


    const feedbacks = await Feedback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();


    const totalPages = Math.ceil(totalFeedbacks / limit);


    return res.status(200).json({
      success: true,

      feedbacks,

      totalFeedbacks,

      currentPage: page,

      totalPages,
    });


  } catch (error) {

    console.error("Get Feedbacks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedbacks.",
    });

  }
};

/* ===========================
   GET SINGLE FEEDBACK
=========================== */
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    return res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Get Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback.",
    });
  }
};

/* ===========================
   DELETE FEEDBACK
=========================== */
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "Feedback not found.",
      });
    }

    await feedback.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Feedback Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete feedback.",
    });
  }
};