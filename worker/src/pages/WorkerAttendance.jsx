import React, { useEffect, useState } from "react";

export default function WorkerAttendance(){

const [records,setRecords] = useState([]);
const [filter,setFilter] = useState("today");

const worker = JSON.parse(localStorage.getItem("workerLoggedIn"));

useEffect(()=>{

if(!worker) return;

fetch(`http://localhost:5000/attendance/history/${worker.workerId}`)
.then(res=>res.json())
.then(data=>setRecords(data))
.catch(()=>setRecords([]));

},[]);

if(!worker) return <h3>Please login</h3>;

/* ---------- GROUP IN / OUT ---------- */

const grouped = {};

records.forEach(r=>{

if(!grouped[r.date]){

grouped[r.date]={
date:r.date,
inTime:"",
outTime:"",
inSelfie:"",
outSelfie:"",
inLocation:null,
outLocation:null
};

}

if(r.type==="IN"){
grouped[r.date].inTime=r.time;
grouped[r.date].inSelfie=r.selfie;
grouped[r.date].inLocation=r.location;
}

if(r.type==="OUT"){
grouped[r.date].outTime=r.time;
grouped[r.date].outSelfie=r.selfie;
grouped[r.date].outLocation=r.location;
}

});

const rows = Object.values(grouped);

/* ---------- FILTER ---------- */

const today = new Date().toISOString().slice(0,10);

const filteredRows = rows.filter(r=>{

if(filter==="today") return r.date===today;

if(filter==="week"){

const now = new Date();
const first = new Date(now.setDate(now.getDate()-now.getDay()));

return new Date(r.date)>=first;

}

if(filter==="month"){

const now = new Date();
const month = now.getMonth();
const year = now.getFullYear();

const d = new Date(r.date);

return d.getMonth()===month && d.getFullYear()===year;

}

return true;

});

/* ---------- SUMMARY ---------- */

const presentDays = filteredRows.length;

let totalDays = 0;

if(filter==="today") totalDays = 1;
if(filter==="week") totalDays = 7;
if(filter==="month") totalDays = new Date().getDate();

const absentDays = totalDays - presentDays;

/* ---------- UI ---------- */

return(

<div style={page}>

<h1 style={title}>My Attendance</h1>

<h3>{worker.name}</h3>
<p style={{marginTop:-10}}>{worker.designation}</p>

{/* SUMMARY */}

<div style={summaryContainer}>

<div style={card}>
<h3>Present</h3>
<p>{presentDays}</p>
</div>

<div style={cardYellow}>
<h3>Absent</h3>
<p>{absentDays}</p>
</div>

</div>


{/* FILTER */}

<div style={{marginBottom:20}}>

<select
value={filter}
onChange={(e)=>setFilter(e.target.value)}
style={select}
>

<option value="today">Today</option>
<option value="week">This Week</option>
<option value="month">This Month</option>

</select>

</div>


{/* TABLE */}

<div style={tableCard}>

{filteredRows.length===0 && <p>No attendance found</p>}

{filteredRows.length>0 && (

<table style={table}>

<thead>

<tr>

<th style={th}>Date</th>
<th style={th}>IN Time</th>
<th style={th}>OUT Time</th>
<th style={th}>IN Selfie</th>
<th style={th}>OUT Selfie</th>
<th style={th}>Location</th>

</tr>

</thead>

<tbody>

{filteredRows.map((r,i)=>(

<tr key={i}>

<td style={td}>{r.date}</td>

<td style={td}>{r.inTime || "-"}</td>

<td style={td}>{r.outTime || "-"}</td>

<td style={td}>

{r.inSelfie && (
<img src={r.inSelfie} style={img}/>
)}

</td>

<td style={td}>

{r.outSelfie && (
<img src={r.outSelfie} style={img}/>
)}

</td>

<td style={td}>

{r.inLocation && r.inLocation.latitude && r.inLocation.longitude && (

<a
href={`https://maps.google.com/?q=${r.inLocation.latitude},${r.inLocation.longitude}`}
target="_blank"
rel="noreferrer"
style={link}
>
📍 View Location
</a>

)}

</td>

</tr>

))}

</tbody>

</table>

)}

</div>


{/* BOTTOM BAR */}

<div style={bottomBar}>

<button
style={blueBtn}
onMouseEnter={(e)=>e.target.style.background="#0369a1"}
onMouseLeave={(e)=>e.target.style.background="#0288D1"}
onClick={()=>setFilter("today")}
>
Today's Attendance
</button>

<button
style={blueBtn}
onMouseEnter={(e)=>e.target.style.background="#0369a1"}
onMouseLeave={(e)=>e.target.style.background="#0288D1"}
onClick={()=>setFilter("week")}
>
This Week
</button>

<button
style={blueBtn}
onMouseEnter={(e)=>e.target.style.background="#0369a1"}
onMouseLeave={(e)=>e.target.style.background="#0288D1"}
onClick={()=>setFilter("month")}
>
This Month
</button>

</div>

</div>

);

}


/* ---------- STYLES ---------- */

const page={
padding:40,
fontFamily:"Segoe UI",
background:"#F3F6FB",
minHeight:"100vh"
};

const title={
fontSize:34,
fontWeight:800,
marginBottom:20
};

const summaryContainer={
display:"flex",
gap:20,
marginBottom:25
};

const card={
flex:1,
background:"white",
padding:20,
borderRadius:14,
textAlign:"center",
border:"2px solid #d4a017"
};

const cardYellow={
...card,
background:"#fef9c3"
};

const tableCard={
background:"white",
padding:18,
borderRadius:14,
border:"2px solid #d4a017",
overflowX:"auto"
};

const table={
width:"100%",
borderCollapse:"collapse"
};

const th={
padding:12,
textAlign:"center",
fontWeight:700,
borderBottom:"2px solid #d4a017",
background:"#F3F6FB"
};

const td={
padding:10,
textAlign:"center",
borderBottom:"1px solid #eee"
};

const img={
width:70,
height:70,
borderRadius:8,
objectFit:"cover"
};

const link={
color:"#0288D1",
fontWeight:600,
textDecoration:"none"
};

const select={
padding:8,
borderRadius:6
};

const bottomBar={
position:"fixed",
bottom:0,
left:0,
right:0,
background:"#fff",
borderTop:"2px solid #d4a017",
padding:"12px 20px",
display:"flex",
justifyContent:"center",
gap:16
};

const blueBtn={
background:"#0288D1",
color:"#fff",
border:"none",
padding:"10px 18px",
borderRadius:10,
fontWeight:600,
cursor:"pointer",
transition:"0.2s"
};