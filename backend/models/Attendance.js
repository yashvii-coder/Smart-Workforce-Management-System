import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    workerId: {
     type: String,
     required: true
   },
    name: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["IN", "OUT","ABSENT"],
      required: true,
    },
    date: {
      type: String,
      required: true, // YYYY-MM-DD
    },
    time: {
      type: String,
      required: true, // HH:mm:ss
    },
    timestamp: {
      type: Number,
      required: true,
    },
    selfie: {
      type: String,
      default: null,
    },
    location: {
      latitude: Number,
      longitude: Number,
    },
  },
  {
    timestamps: true, // ✅ VERY IMPORTANT
  }
);

export default mongoose.model("Attendance", attendanceSchema);
