import express from "express";
import Quotation from "../models/Quotation.js";

const router = express.Router();

/* SAVE QUOTATION */
router.post("/save", async (req,res)=>{
try{

const quotation = new Quotation(req.body);

await quotation.save();

res.json({success:true});

}catch(err){

res.status(500).json({error:err.message});

}
});

/* GET ALL QUOTATIONS */
router.get("/all", async(req,res)=>{

try{

const data = await Quotation.find().sort({createdAt:-1});

res.json(data);

}catch(err){

res.status(500).json({error:err.message});

}

});

/* GET SINGLE QUOTATION */
router.get("/:id", async(req,res)=>{

try{

const q = await Quotation.findById(req.params.id);

res.json(q);

}catch(err){

res.status(500).json({error:err.message});

}

});

/* UPDATE QUOTATION */
router.put("/:id", async(req,res)=>{

try{

const q = await Quotation.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
);

res.json(q);

}catch(err){

res.status(500).json({error:err.message});

}

});

/* DELETE QUOTATION */

router.delete("/:id", async (req, res) => {

try {

const id = req.params.id;

const deleted = await Quotation.findByIdAndDelete(id);

if (!deleted) {
return res.status(404).json({
success:false,
message:"Quotation not found"
});
}

res.json({
success:true,
message:"Quotation deleted",
deletedId:id
});

} catch (err) {

res.status(500).json({
success:false,
error:err.message
});

}

});

export default router;