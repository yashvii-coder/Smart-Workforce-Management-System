import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SavedAttendance() {

const nav = useNavigate();

const currentMonth = String(new Date().getMonth() + 1).padStart(2,"0");

const [month,setMonth] = useState(currentMonth);
const [data,setData] = useState([]);
const [loading,setLoading] = useState(false);


/* ================= LOAD MONTH SHEET ================= */

const loadMonthSheet = async (m) => {

setLoading(true);

try{

const res = await fetch(`http://localhost:5000/attendance/month-sheet/${m}`);
const result = await res.json();

setData(result);

}catch(err){

console.log(err);
alert("Failed to load attendance");

}

setLoading(false);

};


/* ================= AUTO LOAD CURRENT MONTH ================= */

useEffect(()=>{

loadMonthSheet(currentMonth);

},[]);


/* ================= HANDLE MONTH SELECT ================= */

const handleMonthChange = (e)=>{

const selected = e.target.value;

setMonth(selected);
loadMonthSheet(selected);

};


/* ================= DOWNLOAD CSV ================= */

const downloadCSV = () => {

let csv = "Worker,";

for(let i=1;i<=31;i++){
csv += `Day${i},`;
}

csv += "\n";

data.forEach(worker=>{

let row = `${worker.worker},`;

for(let d=1; d<=31; d++){

let val = worker.days[d] || "-";

if(val==="Present") val="P";
if(val==="Late") val="L";
if(val==="Absent") val="A";
if(val==="Pending") val="-";

row += `${val},`;

}

csv += row + "\n";

});

const blob = new Blob([csv],{type:"text/csv"});
const url = window.URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "saved_attendance.csv";

document.body.appendChild(a);
a.click();
document.body.removeChild(a);

};


return(

<div style={page}>

{/* HEADER */}

<div style={header}>

<div>

<h1 style={title}>Saved Attendance</h1>

<p style={subtitle}>
Monthly attendance summary of all workers
</p>

</div>

<select
value={month}
onChange={handleMonthChange}
style={monthDropdown}
>

<option value="01">January</option>
<option value="02">February</option>
<option value="03">March</option>
<option value="04">April</option>
<option value="05">May</option>
<option value="06">June</option>
<option value="07">July</option>
<option value="08">August</option>
<option value="09">September</option>
<option value="10">October</option>
<option value="11">November</option>
<option value="12">December</option>

</select>

</div>


{/* LEGEND */}

<div style={legendBox}>

<span style={legendItem}><b>P</b> = Present</span>
<span style={legendItem}><b>L</b> = Late</span>
<span style={legendItem}><b>A</b> = Absent</span>
<span style={legendItem}><b>-</b> = Pending</span>

</div>


{/* TABLE */}

<div style={tableCard}>

{loading && <h3>Loading...</h3>}

{data.length>0 && (

<div style={{overflowX:"auto"}}>

<table style={table}>

<thead>

<tr>

<th style={{...th,position:"sticky",left:0,background:"#FDF6E3"}}>
Worker
</th>

{Array.from({length:31},(_,i)=>(

<th key={i} style={th}>
{i+1}
</th>

))}

</tr>

</thead>

<tbody>

{data.map((worker,i)=>{

return(

<tr key={i}>

<td style={{...td,position:"sticky",left:0,background:"#fff",fontWeight:600}}>
{worker.worker}
</td>

{Array.from({length:31},(_,d)=>{

let val = worker.days[d+1] || "-";

if(val==="Present") val="P";
if(val==="Late") val="L";
if(val==="Absent") val="A";
if(val==="Pending") val="-";

let styleCell={};

if(val==="P") styleCell={background:"#dcfce7"};
if(val==="L") styleCell={background:"#fef9c3"};
if(val==="A") styleCell={background:"#fee2e2"};
if(val==="-") styleCell={background:"#f5f5dc"};

return(

<td key={d} style={{...td,...styleCell}}>
{val}
</td>

)

})}

</tr>

)

})}

</tbody>

</table>

</div>

)}

</div>


{/* ================= FOOTER ================= */}

<div style={bottomBar}>

<button style={blueBtn} onClick={()=>nav("/admin-attendance")}>
Back to Admin Dashboard
</button>

<button style={goldBtn} onClick={downloadCSV}>
Download CSV
</button>

</div>

</div>

)

}


/* ================= UI ================= */

const page = {
padding: 40,
fontFamily: "Segoe UI",
background: "#F3F6FB",
minHeight: "100vh",
borderRadius: 16
};

const header={
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:20
}

const title = {
fontSize: 34,
fontWeight: 800,
color: "#101820",
marginBottom: 25
};

const subtitle={
color:"#d4a017",
fontSize:16
}

const monthDropdown={
padding:"10px 14px",
borderRadius:10,
border:"2px solid #d4a017",
fontWeight:600,
fontSize:14
}

const legendBox={
display:"flex",
gap:25,
marginBottom:20,
background:"#fff",
padding:"12px 18px",
borderRadius:12,
border:"2px solid #d4a017",
width:"fit-content"
}

const legendItem={
fontSize:14,
color:"#101820"
}

const tableCard={
background:"#fff",
padding:20,
borderRadius:14,
border:"2px solid #d4a017",
boxShadow:"0 10px 25px rgba(0,0,0,0.1)"
}

const table={
minWidth:"1400px",
borderCollapse:"collapse"
}

const th={
padding:12,
textAlign:"center",
fontWeight:700,
background:"#FDF6E3",
borderBottom:"2px solid #d4a017"
}

const td={
padding:10,
textAlign:"center",
borderBottom:"1px solid #eee"
}


/* FOOTER */

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
}

const goldBtn={
background:"linear-gradient(135deg,#d4a017,#b8960f)",
border:"none",
padding:"10px 18px",
borderRadius:10,
fontWeight:700,
cursor:"pointer"
}

const blueBtn={
background:"#0288D1",
color:"#fff",
border:"none",
padding:"10px 18px",
borderRadius:10,
fontWeight:700,
cursor:"pointer"
}