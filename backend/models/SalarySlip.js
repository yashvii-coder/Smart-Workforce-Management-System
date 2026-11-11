import mongoose from "mongoose";

const salarySlipSchema = new mongoose.Schema({

workerId:String,
name:String,
designation:String,

presentDays:Number,
otHours:Number,
lateHours:Number,

basicSalary:Number,
earnedSalary:Number,
otAmount:Number,
allowance:Number,
incAllowance:Number,
increment:Number,

prevBalance:Number,
advance:Number,

salaryMonth:String,
paymentDate:String,

netSalary:Number,

createdAt:{
type:Date,
default:Date.now
}

});

export default mongoose.model("SalarySlip",salarySlipSchema);