import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import WorkerRegister from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Tasks from "./pages/MyTasks";
import WorkerAttendance from "./pages/WorkerAttendance";

function Layout() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/" || location.pathname === "/worker/register";

  return (
    <>
      {!hideSidebar && <Sidebar />}
      <div style={{ marginLeft: hideSidebar ? 0 : 240, padding: 20 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/worker/register" element={<WorkerRegister />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/worker-attendance" element={<WorkerAttendance />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}