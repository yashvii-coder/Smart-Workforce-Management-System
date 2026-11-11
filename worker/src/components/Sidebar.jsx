// src/components/Sidebar.jsx
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaTachometerAlt, FaClipboardList, FaCalendarCheck, FaCamera, FaSignOutAlt } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Mark Attendance", path: "/attendance", icon: <FaCamera /> },
    { name: "Attendance History", path: "/worker-attendance", icon: <FaCalendarCheck /> },
    { name: "My Tasks", path: "/tasks", icon: <FaClipboardList /> },
  ];

  const handleLogout = () => {
    // ✅ Clear the unified login object
    localStorage.removeItem("workerLoggedIn");
    navigate("/"); // Redirect to login page
  };

  return (
    <div
  style={{
    width: 240,
    background: "#101820",
    color: "white",
    padding: "20px 15px",
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0, // ⭐ ensures full screen height
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflowY: "auto"
  }}
>
      <div>
        <h2 style={{ marginBottom: 30, color: "#d4a017", textAlign: "center" }}>
          Smart Workforce
        </h2>

        {menu.map((m) => {
          const active = location.pathname === m.path;
          return (
            <Link
              key={m.name}
              to={m.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 15px",
                borderRadius: 8,
                marginBottom: 10,
                textDecoration: "none",
                color: "white",
                background: active ? "#d4a017" : "transparent",
              }}
            >
              {m.icon}
              {m.name}
            </Link>
          );
        })}
      </div>

      <button
        onClick={handleLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 15px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          background: "#dc2626",
          color: "white",
          fontSize: 15,
        }}
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}