import { Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Workers from "./pages/Workers";
import Tasks from "./pages/Tasks";
import Materials from "./pages/Materials";
import SalarySlip from "./pages/SalarySlip";
import SelectEmployee from "./pages/SelectEmployee";
import Quotation from "./pages/Quotation";
import AdminAttendance from "./pages/AdminAttendance";
import QuotationHistory from "./pages/QuotationHistory";
import SalaryRecords from "./pages/SalaryRecords";
import SavedAttendance from "./pages/SavedAttendance";


import Sidebar from "./components/Sidebar";
import "./styles/sidebar.css";

export default function App() {
  const location = useLocation();
  const hideSidebar = location.pathname === "/";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {!hideSidebar && <Sidebar />}

      {/* 👇 IMPORTANT FIX */}
      <div
        style={{
          flex: 1,
          marginLeft: hideSidebar ? "0" : "256px", // sidebar width
          padding: "20px",
          background: "transparent",
          minHeight: "100vh",
        }}
      >
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workers" element={<Workers />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/salary-slip" element={<SalarySlip />} />
          <Route path="/select-employee" element={<SelectEmployee />} />
          <Route path="/quotation" element={<Quotation />} />
          <Route path="/admin-attendance" element={<AdminAttendance />} />
          <Route path="/quotation/history" element={<QuotationHistory/>}/>
          <Route path="/quotation/history" element={<QuotationHistory/>}/>
          <Route path="/quotation/view/:id" element={<Quotation/>}/>
          <Route path="/quotation/edit/:id" element={<Quotation/>}/>
          <Route path="/salary-records" element={<SalaryRecords/>}/>
          <Route path="/saved-attendance" element={<SavedAttendance />} />

        </Routes>
      </div>
    </div>
  );
}
