import WorkerSidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function WorkerLayout() {
  return (
    <div style={{ display: "flex" }}>
      
      <WorkerSidebar />

      <div
        style={{
          marginLeft: 230,
          padding: 20,
          width: "100%"
        }}
      >
        <Outlet />
      </div>

    </div>
  );
}