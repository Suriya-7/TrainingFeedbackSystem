import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    participantName: {
      type: String,
      required: true,
      trim: true,
    },

    employeeNo: {
      type: String,
      required: true,
      trim: true,
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    presentation: {
      type: String,
      required: true,
    },

    style: {
      type: String,
      required: true,
    },

    material: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    others: {
      type: String,
      required: true,
    },

    expectation: {
      type: String,
      required: true,
    },

    expectationYes: {
      type: String,
      default: "",
    },

    expectationNo: {
      type: String,
      default: "",
    },

    skills: {
      type: String,
      required: true,
    },

    skillsYes: {
      type: String,
      default: "",
    },

    skillsNo: {
      type: String,
      default: "",
    },

    suggestions: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;