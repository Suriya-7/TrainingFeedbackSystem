import mongoose from "mongoose";
import DEPARTMENTS from "../constants/departments.js";
const ratingValues = [
  "Excellent",
  "Very Good",
  "Good",
  "Acceptable",
  "Poor",
];

const feedbackSchema = new mongoose.Schema(
  {
    participantName: {
      type: String,
      required: [true, "Participant Name is required."],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    employeeNo: {
      type: String,
      required: [true, "Employee Number is required."],
      trim: true,
      maxlength: 20,
    },

    department: {
      type: String,
      required: [true, "Department is required."],
      trim: true,
      enum: DEPARTMENTS,
},

    date: {
      type: Date,
      required: [true, "Date is required."],
    },

    course: {
      type: String,
      required: [true, "Course is required."],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    content: {
      type: String,
      required: true,
      enum: ratingValues,
    },

    presentation: {
      type: String,
      required: true,
      enum: ratingValues,
    },

    style: {
      type: String,
      required: true,
      enum: ratingValues,
    },

    material: {
      type: String,
      required: true,
      enum: ratingValues,
    },

    venue: {
      type: String,
      required: true,
      enum: ratingValues,
    },

    others: {
      type: String,
      required: true,
      enum: ratingValues,
    },

    expectation: {
      type: String,
      required: true,
      enum: ["Yes", "No"],
    },

    expectationYes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    expectationNo: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    skills: {
      type: String,
      required: [true, "Skills is required."],
      trim: true,
      maxlength: 1000,
    },

    suggestions: {
      type: String,
      required: [true, "Suggestions are required."],
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;