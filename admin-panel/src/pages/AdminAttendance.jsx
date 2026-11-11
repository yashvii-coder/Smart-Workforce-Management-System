import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminAttendance() {

const nav = useNavigate();

const [rows,setRows] = useState([]);
const [loading,setLoading] = useState(true);
const [month,setMonth] = useState("");
const [viewType,setViewType] = useState("today");
const [selfiePopup,setSelfiePopup] = useState(null);

const [monthSheet,setMonthSheet] = useState([]);
const [weekSheet,setWeekSheet] = useState([]);
const [weekDates,setWeekDates] = useState([]);

useEffect(()=>{

const isAdmin = localStorage.getItem("adminLoggedIn");

if(!isAdmin){
nav("/");
return;
}

loadTodayAttendance();

},[]);


/* ================= TODAY ================= */

const loadTodayAttendance = ()=>{

setLoading(true);

fetch("http://localhost:5000/attendance/admin-today")
.then(res=>res.json())
.then(data=>{

const adjusted = data.map(r=>{
if(r.status==="Late") return {...r,status:"Present (Late)"};
return r;
});

setRows(adjusted);
setLoading(false);
setViewType("today");

});

};


/* ================= WEEK ================= */

const loadWeekAttendance = ()=>{

setLoading(true);

fetch("http://localhost:5000/attendance/week")
.then(res=>res.json())
.then(data=>{

const adjusted = data.map(r=>{
if (r.status === "Late") return { ...r, status: "Present (Late)" };return r;
});

setRows(adjusted);

prepareWeekSheet(adjusted);

setViewType("weekSheet");

setLoading(false);

});

};

const prepareWeekSheet = (data) => {

  const today = new Date();
  const last7 = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    last7.push(d.toISOString().slice(0, 10));
  }

  setWeekDates(last7);

  // get unique workers
  const workers = [...new Set(data.map(r => r.name))];

  const sheet = workers.map(worker => {

    const workerRecords = data.filter(r => r.name === worker);

    const days = {};

    last7.forEach(date => {

      const rec = workerRecords.find(r => r.date === date);

      if (!rec) {
        days[date] = "PE"; // pending
      } else if (rec.status === "Present") {
        days[date] = "P";
      } else if (rec.status === "Present (Late)" || rec.status === "Late") {
        days[date] = "P(L)";
      } else if (rec.status === "Absent") {
        days[date] = "A";
      } else if (rec.status === "Pending") {
        days[date] = "-";
      } else {
        days[date] = "-";
      }

    });

    return { worker, days };

  });

  setWeekSheet(sheet);

};

<div style={{marginBottom:10, fontWeight:600}}>
  Legend: P = Present | P(L) = Present (Late) | A = Absent | - = Pending
</div>


/* ================= MONTH ================= */

const loadMonthSheet = ()=>{

if(!month) return alert("Select month");

setLoading(true);

fetch(`http://localhost:5000/attendance/month-sheet/${month}`)
.then(res=>res.json())
.then(data=>{

setMonthSheet(data);

setViewType("monthSheet");

setLoading(false);

});

};


/* ================= SAVE ================= */

const saveTodayAttendance = async ()=>{

await fetch("http://localhost:5000/attendance/save-today",{method:"POST"});

alert("Today's attendance saved successfully");

};


/* ================= CSV ================= */

const downloadCSV = () => {

let csv = "";


// ================= TODAY =================
if(viewType === "today"){

csv = "Worker,Designation,Date,IN Time,OUT Time,Status\n";

rows.forEach(r=>{
csv += `${r.name},${r.designation},${r.date},${r.inTime||""},${r.outTime||""},${r.status}\n`;
});

downloadFile(csv,"today_attendance.csv");

}


// ================= WEEK =================
else if(viewType === "weekSheet"){

let header = "Worker,";

weekDates.forEach(d=>{
const dt = new Date(d);
header += `${dt.getDate()}-${dt.getMonth()+1},`;
});

header += "Total\n";

csv = header;

weekSheet.forEach(w=>{

let row = `${w.worker},`;

weekDates.forEach(d=>{
row += `${w.days[d]||"-"},`;
});

const presentDays = Object.values(w.days).filter(v=>v==="P"||v==="P(L)").length;
const absentDays = Object.values(w.days).filter(v=>v==="A").length;

row += `${presentDays}P/${absentDays}A\n`;

csv += row;

});

downloadFile(csv,"week_attendance.csv");

}


// ================= MONTH =================
else if(viewType === "monthSheet"){

let header = "Worker,";

for(let i=1;i<=31;i++){
header += `Day${i},`;
}

header += "Total\n";

csv = header;

monthSheet.forEach(w=>{

let row = `${w.worker},`;

for(let d=1;d<=31;d++){
let val = w.days[d];

if(val==="Pending") val="-";

row += `${val||"-"},`;
}

const presentDays = Object.values(w.days).filter(v=>v==="P"||v==="L").length;
const absentDays = Object.values(w.days).filter(v=>v==="A").length;

row += `${presentDays}P/${absentDays}A\n`;

csv += row;

});

downloadFile(csv,"month_attendance.csv");

}

};


/* ========= FILE DOWNLOAD HELPER ========= */

const downloadFile = (csv,filename)=>{

const blob = new Blob([csv],{type:"text/csv"});
const url = window.URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = filename;

document.body.appendChild(a);
a.click();

document.body.removeChild(a);

};


/* ================= SUMMARY ================= */

const totalWorkers=rows.length;
const presentCount=rows.filter(r=>r.status==="Present").length;
const lateCount=rows.filter(r=>r.status==="Present (Late)").length;
const absentCount=rows.filter(r=>r.status==="Absent").length;
const pendingCount=rows.filter(r=>r.status==="Pending").length;


return(

<div style={page}>

<h1 style={title}>Admin Attendance Dashboard</h1>

{/* SUMMARY */}

<div style={summaryContainer}>


<div style={card}><h3>Total</h3><p>{totalWorkers}</p></div>
<div style={cardGreen}><h3>Present</h3><p>{presentCount}</p></div>
<div style={cardYellow}><h3>Late</h3><p>{lateCount}</p></div>
<div style={{...cardYellow,background:"#fef3c7"}}><h3>Pending</h3><p>{pendingCount}</p></div>
<div style={cardRed}><h3>Absent</h3><p>{absentCount}</p></div>

</div>

{/* ===== LEGEND ===== */}

<div style={legendBox}>
<span>🟢 P = Present</span>
<span>🟡 P(L) = Late</span>
<span>🔴 A = Absent</span>
<span>⚪ - = Pending</span>
</div>



{/* ================= TODAY TABLE ================= */}

{viewType==="today" && (

<div style={tableCard}>

<table style={table}>

<thead>

<tr>
<th style={th}>Worker</th>
<th style={th}>Designation</th>
<th style={th}>Date</th>
<th style={th}>IN</th>
<th style={th}>OUT</th>
<th style={th}>In Selfie</th>
<th style={th}>Out Selfie</th>
<th style={th}>Location</th>
<th style={th}>Status</th>
</tr>

</thead>

<tbody>

{rows.map((r,i)=>(

<tr key={i}>

<td style={td}>{r.name}</td>
<td style={td}>{r.designation}</td>
<td style={td}>{r.date}</td>
<td style={td}>{r.inTime||"-"}</td>
<td style={td}>{r.outTime||"-"}</td>

<td style={td}>
{r.inSelfie ?
<button style={blueBtn} onClick={()=>setSelfiePopup(r.inSelfie)}>View</button>
:"-"}
</td>

<td style={td}>
{r.outSelfie ?
<button style={blueBtn} onClick={()=>setSelfiePopup(r.outSelfie)}>View</button>
:"-"}
</td>

<td style={td}>
  {(r.inLocation || r.outLocation) ? (
    <a
      href={`https://www.google.com/maps?q=${
        (r.inLocation || r.outLocation).latitude
      },${
        (r.inLocation || r.outLocation).longitude
      }`}
      target="_blank"
      rel="noreferrer"
      style={{ color: "#0288D1", fontWeight: 600, textDecoration: "none" }}
    >
      📍 Location
    </a>
  ) : "-"}
</td>

<td style={td}>

{r.status==="Present" && <span style={present}>🟢 Present</span>}
{r.status==="Present (Late)" && <span style={late}>🟡 Present (Late)</span>}
{r.status==="Absent" && <span style={absent}>🔴 Absent</span>}
{r.status==="Pending" && <span style={pending}>Pending</span>}

</td>

</tr>

))}

</tbody>

</table>

</div>

)}


{/* ================= WEEK SHEET =================  */}

{viewType==="weekSheet" && (

<div style={tableCard}>

<div style={{overflowX:"auto"}}>

<table style={{...table,minWidth:1000}}>

<thead>

<tr>

<th style={th}>Worker</th>

{weekDates.map((d,i)=>{

const dt=new Date(d);

return(

<th key={i} style={th}>
Day{i+1}<br/>
{dt.getDate()} {dt.toLocaleString("default",{month:"short"})}
</th>

);

})}

<th style={th}>Total</th>

</tr>

</thead>

<tbody>

{weekSheet.map((w, i) => {

  const presentDays = Object.values(w.days).filter(v => v === "P" || v === "P(L)").length;
  const absentDays = Object.values(w.days).filter(v => v === "A").length;

  return (

    <tr key={i}>

      <td style={td}>{w.worker}</td>

      {weekDates.map((d, j) => (
        <td key={j} style={td}>{w.days[d]}</td>
      ))}

      <td style={td}>{presentDays}P / {absentDays}A</td>

    </tr>

  );

})}
</tbody>

</table>

</div>

</div>

)}


 {/* ================= MONTH SHEET =================  */}

{viewType==="monthSheet" && (

<div style={tableCard}>

<div style={{ width: "100%", overflowX: "scroll" }}>

<table style={{...table,minWidth:1500}}>

<thead>

<tr>

<th style={th}>Worker</th>

{Array.from({length:31},(_,i)=>(

<th key={i} style={th}>{i+1}</th>

))}

<th style={th}>Total</th>

</tr>

</thead>

<tbody>

{monthSheet.map((w,i)=>{

const presentDays=Object.values(w.days).filter(v=>v==="P"||v==="L").length;
const absentDays=Object.values(w.days).filter(v=>v==="A").length;

return(

<tr key={i}>

<td style={td}>{w.worker}</td>

{Array.from({length:31},(_,d)=>{

let val=w.days[d+1];

if(val==="Pending") val="-";

return <td key={d} style={td}>{val||"-"}</td>;

})}

<td style={td}>{presentDays}P / {absentDays}A</td>

</tr>

);

})}

</tbody>

</table>

</div>

</div>

)}


{/* ================= SELFIE POPUP =================  */}

{selfiePopup && (

<div style={popupOverlay}>

<div style={popupBox}>

<img src={selfiePopup} alt="Selfie" style={{width:320,borderRadius:10}}/>

<br/>

<button style={closeBtn} onClick={()=>setSelfiePopup(null)}>Close</button>

</div>

</div>

)}


{/* ================ BOTTOM PANEL =================  */}

<div style={bottomBar}>

<button style={goldBtn} onClick={saveTodayAttendance}>Save Today's Attendance</button>

<button style={blueBtn} onClick={downloadCSV}>Download CSV</button>

<button style={blueBtn} onClick={loadWeekAttendance}>View This Week</button>

<select value={month} onChange={(e)=>setMonth(e.target.value)} style={select}>

<option value="">Month</option>

{Array.from({length:12},(_,i)=>(

<option key={i} value={(i+1).toString().padStart(2,"0")}>
{new Date(0,i).toLocaleString("default",{month:"short"})}
</option>

))}

</select>

<button style={goldBtn} onClick={loadMonthSheet}>View Month</button>

<button onClick={()=>nav("/saved-attendance")} style={blueBtn}>View Saved Attendance</button>

</div>

</div>

);

}


/* ================= STYLES ================= */

const page={padding:40,fontFamily:"Segoe UI",background:"#F3F6FB",minHeight:"100vh"};

const title={fontSize:34,fontWeight:800,marginBottom:25};

const legendBox={
display:"flex",
gap:30,
justifyContent:"center",
background:"#fff",
padding:12,
border:"2px solid #d4a017",
borderRadius:12,
marginBottom:20,
fontWeight:600
};

const bottomBar={position:"fixed",bottom:0,left:0,right:0,background:"#fff",borderTop:"2px solid #d4a017",padding:"12px 20px",display:"flex",justifyContent:"center",gap:16};

const goldBtn={background:"linear-gradient(135deg,#d4a017,#b8960f)",border:"none",padding:"10px 18px",borderRadius:10,fontWeight:700,cursor:"pointer"};

const blueBtn={background:"#0288D1",color:"#fff",border:"none",padding:"6px 14px",borderRadius:8,fontWeight:600,cursor:"pointer"};

const select={padding:10,borderRadius:10,border:"2px solid #d4a017"};

const summaryContainer={display:"flex",gap:20,marginBottom:30};

const card={flex:1,background:"white",padding:20,borderRadius:14,textAlign:"center",border:"2px solid #d4a017"};

const cardGreen={...card,background:"#dcfce7"};

const cardYellow={...card,background:"#fef9c3"};

const cardRed={...card,background:"#fee2e2"};

const tableCard={background:"white",padding:18,borderRadius:14,border:"2px solid #d4a017",overflowX:"auto"};

const table={width:"100%",borderCollapse:"collapse"};

const th={padding:12,textAlign:"center",fontWeight:700,borderBottom:"2px solid #d4a017",background:"#F3F6FB"};

const td={padding:10,textAlign:"center",borderBottom:"1px solid #eee"};

const present={color:"#16a34a",fontWeight:600};
const late={color:"#ca8a04",fontWeight:600};
const absent={color:"#dc2626",fontWeight:600};
const pending={color:"#555"};

const popupOverlay={position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center"};

const popupBox={background:"#fff",padding:30,borderRadius:12};

const closeBtn={marginTop:15,background:"#ef4444",color:"#fff",border:"none",padding:"8px 14px",borderRadius:8};