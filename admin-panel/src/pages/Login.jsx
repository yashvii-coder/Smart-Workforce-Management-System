import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const nav = useNavigate();

  function login() {
    if (username.trim() === "") {
      alert("Enter username");
      return;
    }

    // SAVE ADMIN LOGIN STATE
    localStorage.setItem("adminLoggedIn", "true");
    localStorage.setItem("adminName", username);

    alert("Welcome " + username + "!");
    nav("/dashboard");
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <img
          src="/src/assets/grc_logo.jpg"
          alt="LOOKGRC"
          className="login-logo"
        />

        <h2>LOOKGRC ART DECO</h2>
        <div className="subtitle">ADMIN PANEL</div>

        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter admin username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
          />
        </div>

        <button className="btn-login" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
}
