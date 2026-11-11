import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

  workerId: {
    type: String,
    required: true
  },

  workerName: String,

  designation: String,

  task: {
    type: String,
    required: true
  },

  description: String,

  progress: {
    type: Number,
    default: 0
  },

  // Worker message while updating progress
  progressDescription: {
    type: String,
    default: ""
  },

  // Admin feedback message
  adminReview: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    default: "Pending"
  },

  dueDate: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Task", taskSchema);