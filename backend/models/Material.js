import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  category: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
  },

  price: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

export default mongoose.model("Material", materialSchema);