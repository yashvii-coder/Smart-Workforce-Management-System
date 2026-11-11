import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function WorkerRegister() {
  const nav = useNavigate();
  const [form, setForm] = useState({ workerId: "", name: "", designation: "", password: "", basicSalary: "" });
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function register(e) {
    e.preventDefault();
    setErr(""); setMsg("");

    if (!form.workerId || !form.name || !form.designation || !form.password) {
      setErr("Please fill in all required fields"); return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/worker/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) { setErr(data.message || "Registration failed"); return; }

      setMsg("Registration successful! Redirecting to login...");
      setTimeout(() => nav("/"), 1500);
    } catch {
      setErr("Server not responding");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>REGISTER WORKER</h2>
        <form onSubmit={register}>
          <div className="input-group"><label>Worker ID</label><input name="workerId" value={form.workerId} onChange={handleChange} placeholder="Enter Worker ID" /></div>
          <div className="input-group"><label>Name</label><input name="name" value={form.name} onChange={handleChange} placeholder="Enter Name" /></div>
          <div className="input-group"><label>Designation</label><input name="designation" value={form.designation} onChange={handleChange} placeholder="Enter Designation" /></div>
          <div className="input-group"><label>Password</label><input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter Password" /></div>
          <div className="input-group"><label>Basic Salary</label><input name="basicSalary" value={form.basicSalary} onChange={handleChange} placeholder="Enter Basic Salary" /></div>
          {err && <p className="error-text">{err}</p>}
          {msg && <p style={{ color: "green", fontWeight: 600 }}>{msg}</p>}
          <button type="submit" className="btn-login">Register</button>
          <button type="button" className="btn-login" style={{ background: "#eee", color: "#000", marginTop: 8 }} onClick={() => nav("/")}>Back to Login</button>
        </form>
      </div>
    </div>
  );
}