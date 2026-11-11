import express from "express";
import Worker from "../models/Worker.js";
import LoginLog from "../models/LoginLog.js";
import RegistrationLog from "../models/RegistrationLog.js";

const router = express.Router();

/* ================= WORKER REGISTER ================= */

router.post("/register", async (req, res) => {
  try {
    const { workerId, name, designation, password, basicSalary } = req.body || {};

    if (!workerId || !name || !designation || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await Worker.findOne({ workerId });

    if (existing) {
      return res.status(400).json({ message: "Worker already exists" });
    }

    const worker = await Worker.create({
      workerId,
      name,
      designation,
      password,
      basicSalary: basicSalary || 0
    });

    await RegistrationLog.create({
      workerId,
      name,
      designation
    });

    console.log("WORKER REGISTERED:", worker.workerId);

    res.status(201).json({
      message: "Worker registered successfully",
      worker
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ================= WORKER LOGIN ================= */

router.post("/login", async (req, res) => {
  try {

    const { workerId, password } = req.body || {};

    if (!workerId || !password) {
      return res.status(400).json({
        message: "Worker ID and Password required"
      });
    }

    const worker = await Worker.findOne({ workerId });

    if (!worker) {
      return res.status(401).json({
        message: "Worker not found"
      });
    }

    if (worker.password !== password) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    /* ===== SAVE LOGIN LOG ===== */

    const log = await LoginLog.create({
      workerId: worker.workerId,
      name: worker.name
    });

    console.log("LOGIN LOG SAVED:", log);

    res.json({
      workerId: worker.workerId,
      name: worker.name,
      designation: worker.designation
    });

  } catch (err) {

    console.error("LOGIN ERROR:", err);

    res.status(500).json({
      message: "Server error"
    });

  }
});


/* ================= GET ALL WORKERS ================= */

router.get("/all", async (req, res) => {
  try {

    const workers = await Worker.find().select(
      "workerId name designation"
    );

    res.json(workers);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to fetch workers"
    });

  }
});


/* ================= TEST LOGIN LOG ================= */

router.get("/test-log", async (req, res) => {
  try {

    const log = await LoginLog.create({
      workerId: "TEST123",
      name: "Test Worker"
    });

    console.log("TEST LOGIN LOG CREATED:", log);

    res.json(log);

  } catch (e) {

    console.error("TEST LOG ERROR:", e);

    res.status(500).json({
      message: "Test failed"
    });

  }
});

export default router;