import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function WorkerLogin() {

  const nav = useNavigate();

  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("workerLoggedIn");

    if (loggedIn) {
      nav("/dashboard");
    }

  }, [nav]);

  async function login() {

    setErr("");

    if (!workerId.trim()) {
      setErr("Please enter Worker ID");
      return;
    }

    if (!password) {
      setErr("Please enter password");
      return;
    }

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/worker/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            workerId: workerId.trim(),
            password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErr(data.message || "Login failed");
        setLoading(false);
        return;
      }

      const workerData = {
        workerId: String(data.workerId),
        name: data.name,
        designation: data.designation
      };

      localStorage.setItem(
        "workerLoggedIn",
        JSON.stringify(workerData)
      );

      nav("/dashboard");

    } catch (error) {

      console.error(error);
      setErr("Server not responding");

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="login-container">

      <div className="login-card">

        <img src="/grc_logo.jpg" alt="Logo" className="login-logo" />

        <h2>LOOKGRC ART DECO</h2>
        <div className="subtitle">WORKER PANEL</div>

        <div className="input-group">
          <label>Worker ID</label>
          <input
            type="text"
            placeholder="Enter Worker ID"
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {err && <p className="error-text">{err}</p>}

        <button
          className="btn-login"
          onClick={login}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          className="btn-login"
          style={{
            backgroundColor: "#fff",
            color: "#000",
            border: "1px solid #ccc",
            marginTop: "10px"
          }}
          onClick={() => nav("/worker/register")}
        >
          Register New Worker
        </button>

      </div>

    </div>
  );
}