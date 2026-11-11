import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import attendanceRoutes from "./routes/attendanceRoutes.js";
import workerAuthRoutes from "./routes/workerAuth.js";
import taskRoutes from "./routes/taskRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js"; 
import workerRoutes from "./routes/workerRoutes.js";
import salaryRoutes from "./routes/salaryRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";



const app = express();

app.use(express.json());
app.use(cors());

/* ROUTES */

app.use("/attendance", attendanceRoutes);
app.use("/api/worker", workerAuthRoutes);
app.use("/tasks", taskRoutes);
app.use("/quotation", quotationRoutes); 
app.use("/workers", workerRoutes);
app.use("/salary", salaryRoutes);
app.use("/api/materials", materialRoutes);

/* DATABASE */

mongoose
  .connect("mongodb://127.0.0.1:27017/smart_attendance")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

/* SERVER */

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});