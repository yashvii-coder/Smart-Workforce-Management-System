import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
{
  workerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },

  password: { type: String, required: true },

  basicSalary: { type: Number, default: 0 },

  phone: { type: String },

  factory: {
    type: String,
    enum: ["Bhiwandi", "Dombivali"],
    default: "Bhiwandi"
  },

  site: {
    type: String,
    enum: ["Dadar", "Matunga", "Goa", "Pune"],
    default: "Dadar"
  }

},
{ timestamps: true }
);

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;