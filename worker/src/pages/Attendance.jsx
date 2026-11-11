// src/pages/Attendance.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Attendance() {
  const nav = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [user, setUser] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [location, setLocation] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= AUTH + CAMERA + LOCATION ================= */
  useEffect(() => {
    const raw = localStorage.getItem("workerLoggedIn");

    if (!raw) {
      nav("/");
      return;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      nav("/");
      return;
    }

    //  REQUIRED FIELDS CHECK
    if (!parsed.name || !parsed.designation || !parsed.workerId) {
      nav("/");
      return;
    }

    setUser(parsed);

    //  CAMERA
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => setError("Camera permission denied"));

    // 📍 LOCATION
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const { latitude, longitude } = pos.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                Accept: "application/json",
                "User-Agent": "smart-workforce-app"
              }
            }
          );

          const data = await res.json();

          setLocation({
            address:
              data.display_name ||
              `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`,
            latitude,
            longitude
          });
        } catch {
          setLocation({ address: "Location unavailable" });
        }
      },
      () => setError("Location permission denied"),
      { enableHighAccuracy: true, timeout: 15000 }
    );

    return () => {
      videoRef.current?.srcObject?.getTracks().forEach(t => t.stop());
    };
  }, [nav]);

  /* ================= CAPTURE SELFIE ================= */
  function captureSelfie() {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (!video || !canvas) return;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  // compress image to 50% quality
  const image = canvas.toDataURL("image/jpeg", 0.5);

  setSelfie(image);

  video.srcObject?.getTracks().forEach(t => t.stop());
}
  /* ================= MARK IN / OUT ================= */
  async function mark(type) {
    if (loading) return;

    if (!selfie) {
      alert("❌ Capture selfie first");
      return;
    }

    if (!location?.address) {
      alert("❌ Location not captured");
      return;
    }

    setLoading(true);

    try {
      const now = new Date();

      const res = await fetch("http://localhost:5000/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: user.workerId, // ✅ FIXED
          name: user.name,
          designation: user.designation,
          type,
          date: now.toISOString().slice(0, 10),
          time: now.toLocaleTimeString(),
          timestamp: now.getTime(),
          selfie,
          location
        })
      });

      if (!res.ok) throw new Error();

      alert(`✅ ${type} marked successfully`);
      setSelfie(null);
    } catch {
      alert("❌ Attendance failed");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("workerLoggedIn");
    nav("/");
  }

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

      {/* ===== MAIN CARD ===== */}
      <div style={mainCard}>
        {!selfie ? (
          <>
            <video ref={videoRef} autoPlay style={video} />
            <button style={captureBtn} onClick={captureSelfie}>
              Capture Selfie
            </button>
          </>
        ) : (
          <img src={selfie} alt="selfie" style={video} />
        )}

        <canvas ref={canvasRef} style={{ display: "none" }} />

        <p style={locationText}>
          📍 {location?.address || "Detecting location..."}
        </p>

        {error && <p style={errorText}>{error}</p>}

        <div style={btnRow}>
          <button style={inBtn} onClick={() => mark("IN")} disabled={loading}>
            Mark IN
          </button>

          <button style={outBtn} onClick={() => mark("OUT")} disabled={loading}>
            Mark OUT
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageBg = {
  padding: 30,
  minHeight: "100vh",
  background: "linear-gradient(135deg, #1C1C1C, #2B241A)"
};

const topCard = {
  background: "#fff",
  padding: 22,
  borderRadius: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderTop: "5px solid #d4a017"
};

const smallText = { fontSize: 12, fontWeight: 600 };
const userName = { fontSize: 24, fontWeight: 800 };
const designation = { fontSize: 15 };

const mainCard = {
  maxWidth: 520,
  margin: "40px auto",
  background: "#fff",
  padding: 24,
  borderRadius: 18,
  textAlign: "center"
};

const video = {
  width: "100%",
  height: 260,
  objectFit: "cover",
  borderRadius: 14
};

const captureBtn = {
  marginTop: 12,
  width: "100%",
  padding: 12,
  background: "#0288D1",
  color: "#fff",
  borderRadius: 12,
  fontWeight: 700
};

const btnRow = { display: "flex", gap: 10, marginTop: 14 };

const inBtn = { flex: 1, padding: 12, background: "#2e7d32", color: "#fff" };
const outBtn = { flex: 1, padding: 12, background: "#c62828", color: "#fff" };

const locationText = { fontWeight: 600 };
const errorText = { color: "red" };

const logoutBtn = {
  padding: "10px 16px",
  background: "#c62828",
  color: "#fff",
  borderRadius: 12
};

const blueOutlineBtn = {
  padding: "10px 16px",
  border: "2px solid #0288D1",
  color: "#0288D1",
  borderRadius: 12
};
