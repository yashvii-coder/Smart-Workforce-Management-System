import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  code: String,
  name: String,
  qty: Number,
  unit: String,
  rate: Number,
  amount: Number
});

const QuotationSchema = new mongoose.Schema({

  date: String,
  refNo: String,
  client: String,
  project: String,
  kindAttn: String,
  note: String,

  items: [ItemSchema],

  subtotal: Number,
  transport: Number,
  gst: Number,
  gstPercent: Number,
  total: Number,

  createdAt:{
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Quotation", QuotationSchema);