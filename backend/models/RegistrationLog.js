import mongoose from "mongoose";

const registrationLogSchema = new mongoose.Schema({
  workerId: String,
  name: String,
  designation: String,
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("RegistrationLog", registrationLogSchema);