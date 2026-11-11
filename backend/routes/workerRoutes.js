import express from "express";
import Worker from "../models/Worker.js";

const router = express.Router();

/* GET ALL WORKERS */
router.get("/all", async(req,res)=>{

try{

const data = await Worker.find().sort({createdAt:-1});
res.json(data);

}catch(err){

res.status(500).json({error:err.message});

}

});


/* ADD WORKER */
router.post("/save", async(req,res)=>{

try{

const worker = new Worker(req.body);

await worker.save();

res.json({success:true});

}catch(err){

res.status(500).json({error:err.message});

}

});


/* UPDATE WORKER */
router.put("/:id", async(req,res)=>{

try{

const updated = await Worker.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
);

res.json(updated);

}catch(err){

res.status(500).json({error:err.message});

}

});


/* DELETE WORKER */
router.delete("/:id", async(req,res)=>{

try{

await Worker.findByIdAndDelete(req.params.id);

res.json({success:true});

}catch(err){

res.status(500).json({error:err.message});

}

});

export default router;