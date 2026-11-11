import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  ListChecks,
  Package,
  FileText,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      {/* ===== BRAND ===== */}
      <div className="sidebar-brand">
        <h1>LOOK GRC ART DECO</h1>
        <p>SMART WORKFORCE</p>
      </div>

      {/* ===== NAV ===== */}
      <nav className="sidebar-nav">
        <SideItem to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
        <SideItem to="/materials" icon={<Package />} label="Products" />
        <SideItem to="/salary-slip" icon={<FileText />} label="Salary Slip" />
        <SideItem to="/tasks" icon={<ListChecks />} label="Tasks" />
        <SideItem to="/workers" icon={<Users />} label="Workers" />
        <SideItem to="/admin-attendance" icon={<Calendar />} label="Attendance Records" />

      </nav>

      {/* ===== CTA ===== */}
      <div className="sidebar-cta">
        <NavLink to="/quotation">＋ New Quotation</NavLink>
      </div>

      {/* ===== LOGOUT ===== */}
      <div className="sidebar-logout">
        <div
          className="side-item danger"
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          <LogOut />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
}

/* ===== SIDE ITEM ===== */
function SideItem({ to, icon, label, danger }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `side-item ${isActive ? "active" : ""} ${danger ? "danger" : ""}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
