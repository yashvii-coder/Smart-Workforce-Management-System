import mongoose from "mongoose";

const LoginLogSchema = new mongoose.Schema(
  {
    workerId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    loginTime: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: "loginlogs",   // force correct collection
    timestamps: true
  }
);

export default mongoose.model("LoginLog", LoginLogSchema);