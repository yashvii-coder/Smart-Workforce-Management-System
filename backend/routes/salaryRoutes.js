import express from "express";
import SalarySlip from "../models/SalarySlip.js";

const router = express.Router();


/* SAVE SALARY SLIP */

router.post("/save",async(req,res)=>{

try{

const slip = new SalarySlip(req.body);
await slip.save();

res.json({message:"Salary Slip Saved"});

}catch(err){

res.status(500).json(err);

}

});


/* GET ALL SALARY SLIPS */

router.get("/all",async(req,res)=>{

try{

const slips = await SalarySlip.find().sort({createdAt:-1});

res.json(slips);

}catch(err){

res.status(500).json(err);

}

});

export default router;