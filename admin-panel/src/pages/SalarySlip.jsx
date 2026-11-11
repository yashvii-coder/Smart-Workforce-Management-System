import React, { useState } from "react";
import { workers } from "../data/workersData";
import html2pdf from "html2pdf.js";
import letterhead from "/letterhead.png";
import { Link } from "react-router-dom";


export default function SalarySlip() {
  const [selectedId, setSelectedId] = useState("");
  const [emp, setEmp] = useState(null);
  const [preview, setPreview] = useState(false);

  const [inputs, setInputs] = useState({
    presentDays: "",
    otHours: "",
    lateHours: "",
    allowance: "",
    increment: "",
    prevBalance: "",
    earnedSalary: "",
    otAmount: "",
    incAllowance: "",
    advance: "",
    basicSalary: "",
    salaryMonth: new Date().toISOString().split("T")[0],
    paymentDate: new Date().toISOString().split("T")[0],
  });

  const handleSelect = (id) => {
    setSelectedId(id);
    const worker = workers.find((w) => w.id === id);
    if (!worker) return;

    setEmp(worker);
    setPreview(false);

    setInputs((prev) => ({
      ...prev,
      presentDays: worker.presentDays || "",
      otHours: worker.otHours || "",
      earnedSalary: worker.basicSalary || "",
      basicSalary: worker.basicSalary || "",
    }));
  };

  const saveSalarySlip = async () => {

const payload = {

workerId: emp.id,
name: emp.name,
designation: emp.designation,

...inputs,

netSalary: calculateNet()

};

await fetch("http://localhost:5000/salary/save",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
});

alert("Salary Slip Saved");

};
  const handleInput = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculateNet = () => {
    return (
      Number(inputs.basicSalary || 0) +
      Number(inputs.earnedSalary || 0) +
      Number(inputs.otAmount || 0) +
      Number(inputs.allowance || 0) +
      Number(inputs.incAllowance || 0) +
      Number(inputs.increment || 0) +
      Number(inputs.prevBalance || 0) -
      Number(inputs.advance || 0)
    );
  };

  const generatePDF = () => {
    const element = document.getElementById("salary-slip-pdf");
const opt = {
  margin: [5, 5, 5, 5], // ⭐ margin kam
  filename: "Salary_Slip.pdf",
  html2canvas: {
    scale: 1.6,          // ⭐ scale kam (2 → 1.6)
    scrollY: 0,
    useCORS: true,
    allowTaint: true,
  },
  jsPDF: {
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  },
  pagebreak: { mode: ["avoid-all"] }, // ⭐ force single page
};


    html2pdf().set(opt).from(element).save();
  }

  return (
    <div style={{ padding: 30 }}>

      {/* ===== HEADING ===== */}
       <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#fff" }}>
        Salary Slip Generator
      </h1>

      {/* ===== EMPLOYEE SELECT ===== */}
      <select
        value={selectedId}
        onChange={(e) => handleSelect(e.target.value)}
        style={{
          marginTop: 20,
          padding: 10,
          width: 320,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      >
        <option value="">-- Select Employee --</option>
        {workers.map((w) => (
          <option key={w.id} value={w.id}>
            {w.name} ({w.id})
          </option>
        ))}
      </select>

      {/* ===== INPUT CARD ===== */}
      {emp && !preview && (
        <div
          style={{
            marginTop: 30,
            padding: 30,
            width: 650,
            background: "#ffffff",
            borderRadius: 12,
boxShadow: "0 14px 32px rgba(0,0,0,0.18)",
borderTop: "4px solid #d4a017",
borderRadius: 14,
          }}
        >
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 15 }}>
            Enter Salary Details
          </h3>

          {[
            ["presentDays", "Present Days"],
            ["otHours", "OT Hours"],
            ["lateHours", "Late Hours"],
            ["basicSalary", "Basic Salary"],
            ["earnedSalary", "Earned Salary"],
            ["otAmount", "OT Amount"],
            ["allowance", "Allowance"],
            ["incAllowance", "Increment Allowance"],
            ["increment", "Yearly Increment"],
            ["prevBalance", "Previous Balance (+)"],
            ["advance", "Advance (-)"],
          ].map(([key, label]) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <label style={{ width: 240, display: "inline-block", fontWeight: 600 }}>
                {label}
              </label>
              <input
                type="number"
                name={key}
                value={inputs[key]}
                onChange={handleInput}
                style={{
                  padding: "6px 10px",
                  width: 160,
                  border: "1px solid #ccc",
                  borderRadius: 6,
                }}
              />
            </div>
          ))}

          <div style={{ marginBottom: 12 }}>
            <label style={{ width: 240, display: "inline-block", fontWeight: 600 }}>
              Salary of Month
            </label>
            <input type="date" name="salaryMonth" value={inputs.salaryMonth} onChange={handleInput} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ width: 240, display: "inline-block", fontWeight: 600 }}>
              Payment Date
            </label>
            <input type="date" name="paymentDate" value={inputs.paymentDate} onChange={handleInput} />
          </div>

          <button
            onClick={() => setPreview(true)}
            style={{
              padding: "10px 26px",
background: "linear-gradient(135deg, #f4c430, #d4a017)",
color: "#0A0F1F",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Preview Salary Slip
          </button>
        </div>
      )}

      {/* ===== PDF PREVIEW ===== */}
      {preview && emp && (
        <>
        <div
  id="salary-slip-pdf"
  style={{
    width: "210mm",
    minHeight: "297mm",
    background: "white",

    /* 🔑 KEY FIXES */
    padding: "6mm",              // reduced padding
    boxSizing: "border-box",     // VERY IMPORTANT
    overflow: "hidden",          // prevent right cut
    border: "1px solid #000",    // thinner border
  }}
>



<img
  src={letterhead}
  alt="Letterhead"
  style={{
    width: "100%",
    display: "block",
    marginBottom: "8px"
  }}
/>

            <h2 style={{ textAlign: "center", marginTop: 10 }}>SALARY SLIP</h2>

            <table
  width="100%"
  border="1"
  style={{
    width: "100%",
    tableLayout: "fixed",   // ⭐ prevents overflow
    borderCollapse: "collapse",
    fontSize: 14,           // slightly smaller
    marginTop: 14,
  }}
>

              <tbody>
                <tr>
                  <td><b style={{ color: "red" }}>EMPLOYEE ID</b></td>
                  <td>{emp.id}</td>
                  <td><b style={{ color: "red" }}>SALARY OF MONTH</b></td>
                  <td>{inputs.salaryMonth}</td>
                </tr>

                <tr>
                  <td><b>NAME</b></td>
                  <td>{emp.name}</td>
                  <td><b>PAYMENT DATE</b></td>
                  <td>{inputs.paymentDate}</td>
                </tr>

                <tr>
                  <td><b>DESIGNATION</b></td>
                  <td>{emp.designation}</td>
                  <td><b>BASIC SALARY</b></td>
                  <td>{inputs.basicSalary}</td>
                </tr>

                <tr>
                  <td><b>PRESENT DAYS</b></td>
                  <td>{inputs.presentDays}</td>
                  <td><b>EARNED SALARY</b></td>
                  <td>{inputs.earnedSalary}</td>
                </tr>

                <tr>
                  <td><b>OT HOURS</b></td>
                  <td>{inputs.otHours}</td>
                  <td><b>OT AMOUNT (+)</b></td>
                  <td>{inputs.otAmount}</td>
                </tr>

                <tr>
                  <td><b>LATE HOURS</b></td>
                  <td>{inputs.lateHours}</td>
                  <td><b>ALLOWANCE (+)</b></td>
                  <td>{inputs.allowance}</td>
                </tr>

                <tr>
                  <td><b>YEARLY INCREMENT (+)</b></td>
                  <td>{inputs.increment}</td>
                  <td><b>INCREMENT ALLOWANCE (+)</b></td>
                  <td>{inputs.incAllowance}</td>
                </tr>

                <tr>
                  <td><b>PREVIOUS BALANCE (+)</b></td>
                  <td>{inputs.prevBalance}</td>
                  <td><b style={{ color: "red" }}>ADVANCE (-)</b></td>
                  <td>{inputs.advance}</td>
                </tr>

                <tr>
                  <td colSpan="2"></td>
                  <td><b>NET SALARY</b></td>
                  <td><b>₹ {calculateNet()}</b></td>
                </tr>

                <tr>
                  <td colSpan="2"></td>
                  <td><b>PAYABLE AMOUNT</b></td>
                  <td><b>₹ {calculateNet()}</b></td>
                </tr>

                <tr>
                  <td colSpan="4" style={{ padding: 0 }}>
                    <table
                      border="1"
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: 15,
                        fontSize: "14px",
                      }}
                    >
                      <tbody>
                        <tr>
                          <td style={{ height: 40, textAlign: "center" }}>AUTHORISED</td>
                          <td style={{ height: 40, textAlign: "center" }}>RECEIVER</td>
                          <td style={{ height: 40, textAlign: "center" }}>SIGNATURE</td>
                          <td style={{ height: 40, textAlign: "center" }}>SIGNATURE</td>
                        </tr>
                        <tr>
                          <td style={{ height: 80 }}></td>
                          <td style={{ height: 80 }}></td>
                          <td style={{ height: 80 }}></td>
                          <td style={{ height: 80 }}></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
<div style={{marginTop:20}}>

<button
onClick={generatePDF}
style={{
marginRight:15,
padding:"10px 28px",
background:"linear-gradient(135deg,#0288D1,#01579B)",
color:"#fff",
border:"none",
borderRadius:8,
cursor:"pointer"
}}
>
Download PDF
</button>

<button
onClick={saveSalarySlip}
style={{
padding:"10px 28px",
background:"linear-gradient(135deg,#f4c430,#d4a017)",
color:"#0A0F1F",
border:"none",
borderRadius:8,
cursor:"pointer"
}}
>
Save Salary Slip
</button>

<Link
to="/salary-records"
style={{
display:"inline-block",
marginTop:20,
marginLeft:15,
padding:"10px 28px",
background:"#0A0F1F",
color:"#fff",
borderRadius:8,
textDecoration:"none",
fontWeight:600
}}
>

View Saved Salary Slips

</Link>


</div>
        </>
      )}
    </div>
  );
}
