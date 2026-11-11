import React from "react";
import { workers } from "../data/workersData";
import { Link } from "react-router-dom";

export default function SelectEmployee() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Select Employee</h1>

      <select
        className="border p-3 w-full mb-5"
        onChange={(e) => {
          if (e.target.value !== "") {
            window.location.href = `/salary-slip/${e.target.value}`;
          }
        }}
      >
        <option value="">-- Select Worker --</option>

        {workers.map((w) => (
          <option key={w.id} value={w.id}>
            {w.id} - {w.name}
          </option>
        ))}
      </select>
    </div>
  );
}
