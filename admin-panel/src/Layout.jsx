// import { Outlet, Link } from "react-router-dom";

// export default function Layout() {
//   return (
//     <div style={{ display: "flex", height: "100vh", width: "100vw" }}>
      
//       {/* Sidebar */}
//       <div
//         style={{
//           width: "260px",
//           background: "#0A121F",
//           color: "white",
//           padding: "25px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "25px",
//         }}
//       >
//         <h2>Smart Workforce</h2>

//         <Link to="/" style={linkStyle}>Dashboard</Link>
//         <Link to="/tasks" style={linkStyle}>Tasks</Link>
//         <Link to="/attendance" style={linkStyle}>Attendance</Link>
//         <Link to="/workers" style={linkStyle}>Workers</Link>
//         <Link to="/materials" style={linkStyle}>Materials</Link>
//         <Link to="/salary-slip" style={linkStyle}>Salary Slip</Link>
//       </div>

//       {/* Content */}
//       <div
//         style={{
//           flex: 1,
//           padding: "40px",
//           overflowY: "auto",
//           background: "#F5F6F8",
//         }}
//       >
//         <Outlet />
//       </div>
//     </div>
//   );
// }

// const linkStyle = {
//   color: "white",
//   textDecoration: "none",
//   fontSize: "18px",
// };
