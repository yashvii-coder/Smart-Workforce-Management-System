import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

/* ================= CREATE TASK ================= */

router.post("/create", async (req, res) => {
  try {

    const task = await Task.create(req.body);

    res.json(task);

  } catch (err) {

    console.log(err);
    res.status(500).json({ error: "Task creation failed" });

  }
});


/* ================= ADMIN - GET ALL TASKS ================= */

router.get("/all", async (req, res) => {
  try {

    const tasks = await Task.find().sort({ createdAt: -1 });

    res.json(tasks);

  } catch (err) {

    res.status(500).json({ error: "Fetch failed" });

  }
});


/* ================= WORKER TASKS ================= */

router.get("/worker/:workerId", async (req, res) => {
  try {

    const tasks = await Task.find({
      workerId: req.params.workerId
    }).sort({ createdAt: -1 });

    res.json(tasks);

  } catch (err) {

    console.log(err);
    res.status(500).json({ error: "Worker tasks failed" });

  }
});


/* ================= UPDATE TASK PROGRESS ================= */

router.put("/update/:id", async (req, res) => {

try {

const { progress, progressDescription } = req.body;

let status = "Pending";

if (progress == 100) status = "Completed";
else if (progress > 0) status = "In Progress";

const task = await Task.findByIdAndUpdate(
req.params.id,
{
progress,
progressDescription,
status
},
{ new: true }
);

res.json(task);

} catch (err) {

console.log(err);
res.status(500).json({ error: "Update failed" });

}

});

/* ================= ADMIN COMMENT ================= */

router.put("/status/:id", async (req, res) => {

try {

const { status, adminReview } = req.body;

const task = await Task.findByIdAndUpdate(
req.params.id,
{
status,
adminReview
},
{ new: true }
);

res.json(task);

} catch (err) {

console.log(err);
res.status(500).json({ error: "Status update failed" });

}

});
export default router;