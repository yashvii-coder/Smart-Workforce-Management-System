import mongoose from "mongoose";

const savedAttendanceSchema = new mongoose.Schema({
  date: String,
  records: [
    {
      workerId: String,
      name: String,
      designation: String,
      inTime: String,
      outTime: String,
      status: String,
    }
  ],
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("SavedAttendance", savedAttendanceSchema);