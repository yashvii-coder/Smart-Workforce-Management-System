import express from "express";
import Attendance from "../models/Attendance.js";
import Worker from "../models/Worker.js";

const router = express.Router();

/* ================= MARK ATTENDANCE ================= */
router.post("/mark", async (req, res) => {
  try {
    const { workerId, name, designation, type, date, time, timestamp, selfie, location } = req.body;

    if (!workerId || !type || !date || !time || !timestamp) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const todayRecords = await Attendance.find({ workerId, date });
    const alreadyIn = todayRecords.find(r => r.type === "IN");
    const alreadyOut = todayRecords.find(r => r.type === "OUT");

    if (type === "IN" && alreadyIn) return res.status(400).json({ error: "IN already marked today" });
    if (type === "OUT" && !alreadyIn) return res.status(400).json({ error: "Mark IN first" });
    if (type === "OUT" && alreadyOut) return res.status(400).json({ error: "OUT already marked today" });

    const attendance = await Attendance.create({
      workerId, name, designation, type, date, time, timestamp, selfie: selfie || null, location: location || null
    });

    res.status(201).json({ message: `Successfully marked ${type}`, attendance });

  } catch (err) {
    console.error("Attendance Error:", err);
    res.status(500).json({ error: "Attendance failed" });
  }
});

/* ================= WORKER HISTORY ================= */
router.get("/history/:workerId", async (req, res) => {
  try {
    const { workerId } = req.params;
    const records = await Attendance.find({ workerId }).sort({ timestamp: -1 });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

/* ================= ADMIN TODAY (with Pending) ================= */
router.get("/admin-today", async (req, res) => {
  try {
    const workers = await Worker.find();
    const today = new Date().toISOString().slice(0, 10);
    const records = await Attendance.find({ date: today });

    const result = workers.map(worker => {
      const workerRecords = records.filter(r => r.workerId === worker.workerId);

      let inTime = "";
      let outTime = "";
      let inSelfie = "";
      let outSelfie = "";
      let inLocation = null;
      let outLocation = null;

      workerRecords.forEach(r => {
        if (r.type === "IN") {
          inTime = r.time;
          inSelfie = r.selfie;
          inLocation = r.location;
        }
        if (r.type === "OUT") {
          outTime = r.time;
          outSelfie = r.selfie;
          outLocation = r.location;
        }
      });

      // Determine status
      let status = inTime ? "Present" : "Pending";
      if (inTime) {
        const hour = new Date(`${today} ${inTime}`).getHours();
        if (hour >= 10) status = "Present (Late)";
      }

      return {
        name: worker.name,
        designation: worker.designation,
        date: today,
        inTime,
        outTime,
        inSelfie,
        outSelfie,
        inLocation,
        outLocation,
        status
      };
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch admin attendance" });
  }
});

/* ================= ALL ATTENDANCE ================= */
router.get("/all", async (req, res) => {
  try {
    const workers = await Worker.find();
    const records = await Attendance.find();
    const result = [];

    workers.forEach(worker => {
      const workerRecords = records.filter(r => r.workerId === worker.workerId);
      const grouped = {};

      workerRecords.forEach(r => {
        if (!grouped[r.date]) grouped[r.date] = {};
        if (r.type === "IN") grouped[r.date].inTime = r.time;
        if (r.type === "OUT") grouped[r.date].outTime = r.time;
      });

      Object.keys(grouped).forEach(date => {
        let inTime = grouped[date].inTime || "";
        let outTime = grouped[date].outTime || "";
        let status = inTime ? "Present" : "Pending";

        if (inTime) {
          const hour = new Date(`${date} ${inTime}`).getHours();
          if (hour >= 10) status = "Late";
        }

        result.push({
          name: worker.name,
          designation: worker.designation,
          date,
          inTime,
          outTime,
          inSelfie: grouped[date].inSelfie || "",
          outSelfie: grouped[date].outSelfie || "",
          inLocation: grouped[date].inLocation || null,
          outLocation: grouped[date].outLocation || null,
          status
        });
      });
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

/* ================= WEEK ATTENDANCE (Pending) ================= */
router.get("/week", async (req, res) => {
  try {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 6); // last 7 days including today
    const workers = await Worker.find();

    const records = await Attendance.find({
      timestamp: { $gte: lastWeek, $lte: today }
    });

    const result = [];

    workers.forEach(worker => {
      const workerRecords = records.filter(r => r.workerId === worker.workerId);
      const grouped = {};

      workerRecords.forEach(r => {
        if (!grouped[r.date]) grouped[r.date] = {};
        if (r.type === "IN") grouped[r.date].inTime = r.time;
        if (r.type === "OUT") grouped[r.date].outTime = r.time;
      });

      for (let i = 6; i >= 0; i--) {
        const dateObj = new Date(today);
        dateObj.setDate(today.getDate() - i);
        const date = dateObj.toISOString().slice(0, 10);
        const inTime = grouped[date]?.inTime || "";
        const outTime = grouped[date]?.outTime || "";
        let status = inTime ? "Present" : (date <= today.toISOString().slice(0,10) ? "Pending" : "");

        if (inTime) {
          const hour = new Date(`${date} ${inTime}`).getHours();
          if (hour >= 10) status = "Late";
        }

        result.push({
          name: worker.name,
          designation: worker.designation,
          date,
          inTime,
          outTime,
          status
        });
      }
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weekly attendance" });
  }
});

/* ================= MONTH SHEET (Pending) ================= */
router.get("/month-sheet/:month", async (req, res) => {
  try {
    const month = req.params.month;
    const workers = await Worker.find();
    const records = await Attendance.find({ date: { $regex: `-${month}-` } });

    const result = workers.map(worker => {
      const days = {};
      for (let i = 1; i <= 31; i++) days[i] = "Pending"; // default pending

      records
        .filter(r => r.workerId === worker.workerId)
        .forEach(r => {
          const day = parseInt(r.date.split("-")[2]);
          if (r.type === "IN") {
            const hour = new Date(`${r.date} ${r.time}`).getHours();
            days[day] = hour >= 10 ? "L" : "P";
          }
        });

      return { worker: worker.name, designation: worker.designation, days };
    });

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch monthly sheet" });
  }
});

/* ================= SAVE TODAY (Mark ABSENT) ================= */
router.post("/save-today", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const workers = await Worker.find();
    const attendanceToday = await Attendance.find({ date: today });

    const presentWorkerIds = attendanceToday.filter(r => r.type === "IN").map(r => r.workerId);
    const absentWorkers = workers.filter(w => !presentWorkerIds.includes(w.workerId));

    const absentRecords = absentWorkers.map(w => ({
      workerId: w.workerId,
      name: w.name,
      designation: w.designation,
      type: "ABSENT",
      date: today,
      time: "",
      timestamp: new Date(),
      selfie: null,
      location: null,
      status: "Absent"
    }));

    if (absentRecords.length > 0) await Attendance.insertMany(absentRecords);

    res.json({
      message: "Today's attendance saved, absent marked for missing workers",
      savedAbsentCount: absentRecords.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Save failed" });
  }
});

export default router;