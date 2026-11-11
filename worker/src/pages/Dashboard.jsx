// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("workerLoggedIn");
    if (!raw) {
      nav("/");
      return;
    }
    try {
      setUser(JSON.parse(raw));
    } catch (e) {
      localStorage.removeItem("workerLoggedIn");
      nav("/");
    }
  }, [nav]);

  const logout = () => {
    localStorage.removeItem("workerLoggedIn");
    nav("/");
  };

  if (!user) return null;

  return (
    <div style={pageBg}>
      {/* ===== TOP CARD ===== */}
      <div style={topCard}>
        <div>
          <div style={smallText}>Logged in as</div>
          <div style={userName}>{user.name}</div>
          <div style={designation}>{user.designation}</div>
        </div>

        
      </div>

      {/* ===== CONTENT ===== */}
      <div style={contentGrid}>
        {/* QUICK ACTIONS */}
        <div style={card}>
          <h3 style={cardTitle}>Quick Actions</h3>
          <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
            <Link to="/attendance">
              <button style={smallGoldBtn}>Mark Attendance</button>
            </Link>
            <Link to="/history">
              <button style={smallBlueBtn}>View Attendance</button>
            </Link>
          </div>
        </div>

        {/* NOTES */}
        <div style={card}>
          <h3 style={cardTitle}>Important Notes</h3>
          <ul style={noteList}>
            <li>Selfie capture is camera-only (no upload).</li>
            <li>Location uses browser GPS.</li>
            <li>Mark IN in morning & OUT later.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageBg = {
  padding: 30,
  minHeight: "100vh",
  fontFamily: "Segoe UI, sans-serif",
  background: "linear-gradient(135deg, #1C1C1C 0%, #2B241A 100%)", // no grey
};

const topCard = {
  background: "#ffffff",
  padding: 24,
  borderRadius: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 14px 34px rgba(0,0,0,0.15)",
  borderTop: "5px solid #d4a017",
};

const smallText = {
  fontSize: 12,
  color: "#7a5c00",
  fontWeight: 600,
};

const userName = {
  fontSize: 24,
  fontWeight: 800,
  color: "#101820",
};

const designation = {
  fontSize: 15,
  color: "#4a4a4a",
  fontWeight: 600,
};

const contentGrid = {
  maxWidth: 1100,
  margin: "36px auto 0",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 26,
};

const card = {
  background: "#ffffff",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 10px 26px rgba(0,0,0,0.12)",
  borderLeft: "4px solid #f4c430",
};

const cardTitle = {
  margin: 0,
  fontSize: 19,
  fontWeight: 800,
  color: "#101820",
};

const noteList = {
  marginTop: 16,
  lineHeight: 1.8,
  color: "#333",
  fontSize: 15,
};

/* ===== BUTTONS ===== */

const goldBtn = {
  padding: "11px 18px",
  background: "linear-gradient(135deg, #f4c430, #d4a017)",
  color: "#1a1a1a",
  border: "none",
  borderRadius: 12,
  fontWeight: 800,
  cursor: "pointer",
};

const blueOutlineBtn = {
  padding: "11px 18px",
  background: "#ffffff",
  color: "#0288D1",
  border: "2px solid #0288D1",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const logoutBtn = {
  padding: "11px 16px",
  background: "#c62828",
  color: "#fff",
  border: "none",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};

const smallGoldBtn = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, #f4c430, #d4a017)",
  color: "#1a1a1a",
  border: "none",
  borderRadius: 10,
  fontWeight: 800,
  cursor: "pointer",
};

const smallBlueBtn = {
  padding: "10px 16px",
  background: "#0288D1",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  cursor: "pointer",
};
