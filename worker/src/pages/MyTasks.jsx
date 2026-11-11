import React, { useEffect, useState } from "react";

export default function MyTasks(){

const [tasks,setTasks] = useState([]);
const [viewType,setViewType] = useState("today");
const [notification,setNotification] = useState("");

const worker = JSON.parse(localStorage.getItem("workerLoggedIn"));
const workerId = worker?.workerId;

const [progressState,setProgressState] = useState({});
const [progressText,setProgressText] = useState({});

/* ================= LOAD TASKS ================= */

useEffect(()=>{

if(!workerId) return;

fetch(`http://localhost:5000/tasks/worker/${workerId}`)
.then(res=>res.json())
.then(data=>{

setTasks(data);

const p = {};
data.forEach(t=>{
p[t._id] = t.progress;
});

setProgressState(p);

});

},[workerId]);


/* ================= FILTER ================= */

const filteredTasks = tasks.filter(t=>{

if(viewType==="all") return true;

const today = new Date();
const taskDate = new Date(t.dueDate);

if(viewType==="today"){
return taskDate.toDateString()===today.toDateString();
}

if(viewType==="week"){
const weekEnd = new Date();
weekEnd.setDate(today.getDate()+7);
return taskDate>=today && taskDate<=weekEnd;
}

return true;

});


/* ================= SAVE UPDATE ================= */

const saveProgress = async(id)=>{

const progress = progressState[id];
const description = progressText[id] || "";

const res = await fetch(
`http://localhost:5000/tasks/update/${id}`,
{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
progress,
progressDescription:description
})
}
);

const updated = await res.json();

setTasks(tasks.map(t=>t._id===id?updated:t));

setNotification("Task update sent to admin");

setTimeout(()=>setNotification(""),3000);

};


/* ================= PROGRESS COLOR ================= */

const getProgressColor = (value)=>{

if(value >= 80) return "#16a34a";
if(value >= 40) return "#facc15";
return "#f97316";

};


/* ================= SUMMARY ================= */

const total = filteredTasks.length;
const pending = filteredTasks.filter(t=>t.status==="Pending").length;
const progress = filteredTasks.filter(t=>t.status==="In Progress").length;
const completed = filteredTasks.filter(t=>t.status==="Completed").length;


/* ================= UI ================= */

return(

<div style={page}>

<h1 style={title}>My Tasks</h1>

{notification &&(
<div style={notify}>
✅ {notification}
</div>
)}

{/* SUMMARY */}

<div style={summaryContainer}>

<div style={card}><h3>Total</h3><p>{total}</p></div>
<div style={cardYellow}><h3>Pending</h3><p>{pending}</p></div>
<div style={cardBlue}><h3>In Progress</h3><p>{progress}</p></div>
<div style={cardGreen}><h3>Completed</h3><p>{completed}</p></div>

</div>


{/* ================= TASK TABLE ================= */}

<div style={tableCard}>

<table style={table}>

<thead>

<tr>
<th style={th}>Task</th>
<th style={th}>Due Date</th>
<th style={th}>Progress</th>
<th style={th}>Update Description</th>
<th style={th}>Admin Feedback</th>
<th style={th}>Status</th>
<th style={th}>Save</th>
</tr>

</thead>

<tbody>

{filteredTasks.map((t,i)=>{

const progressValue = progressState[t._id] || 0;
const progressColor = getProgressColor(progressValue);

return(

<tr key={i}>

<td style={td}>{t.task}</td>

<td style={td}>
{new Date(t.dueDate).toLocaleDateString()}
</td>

{/* PROGRESS */}

<td style={td}>

<input
type="range"
min="0"
max="100"
value={progressValue}
style={{
width:"160px",
accentColor:progressColor
}}
onChange={(e)=>setProgressState({
...progressState,
[t._id]:e.target.value
})}
/>

<br/>

<b style={{color:progressColor}}>
{progressValue}%
</b>

</td>


{/* WORKER DESCRIPTION */}

<td style={td}>

<textarea
placeholder="Describe progress..."
style={textarea}
onChange={(e)=>setProgressText({
...progressText,
[t._id]:e.target.value
})}
/>

</td>


{/* ADMIN FEEDBACK */}

<td style={{
...td,
fontWeight:600,
color:"#0288D1"
}}>
{t.adminReview || "-"}
</td>


<td style={td}>{t.status}</td>


{/* SAVE BUTTON */}

<td style={td}>

<button
style={saveBtn}
onMouseEnter={(e)=>e.target.style.background="#15803d"}
onMouseLeave={(e)=>e.target.style.background="#16a34a"}
onClick={()=>saveProgress(t._id)}
>
Save Update
</button>

</td>

</tr>

);

})}

</tbody>

</table>

</div>


{/* ================= BOTTOM PANEL ================= */}

<div style={bottomBar}>

<button
style={blueBtn}
onMouseEnter={(e)=>e.target.style.background="#0369a1"}
onMouseLeave={(e)=>e.target.style.background="#0288D1"}
onClick={()=>setViewType("today")}
>
Today's Tasks
</button>

<button
style={blueBtn}
onMouseEnter={(e)=>e.target.style.background="#0369a1"}
onMouseLeave={(e)=>e.target.style.background="#0288D1"}
onClick={()=>setViewType("week")}
>
This Week
</button>

<button
style={blueBtn}
onMouseEnter={(e)=>e.target.style.background="#0369a1"}
onMouseLeave={(e)=>e.target.style.background="#0288D1"}
onClick={()=>setViewType("all")}
>
All Tasks
</button>

</div>

</div>

);

}


/* ================= STYLES ================= */

const page={
padding:40,
fontFamily:"Segoe UI",
background:"#F3F6FB",
minHeight:"100vh"
};

const title={
fontSize:34,
fontWeight:800,
marginBottom:25
};

const notify={
position:"fixed",
top:20,
right:20,
background:"#16a34a",
color:"#fff",
padding:"12px 18px",
borderRadius:10,
fontWeight:600
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

const saveBtn={
background:"#16a34a",
color:"#fff",
border:"none",
padding:"8px 14px",
borderRadius:8,
fontWeight:600,
cursor:"pointer",
transition:"0.2s"
};

const textarea={
width:150,
height:50,
borderRadius:6,
border:"1px solid #ccc",
padding:6
};

const summaryContainer={
display:"flex",
gap:20,
marginBottom:30
};

const card={
flex:1,
background:"white",
padding:20,
borderRadius:14,
textAlign:"center",
border:"2px solid #d4a017"
};

const cardGreen={...card,background:"#dcfce7"};
const cardYellow={...card,background:"#fef9c3"};
const cardBlue={...card,background:"#e0f2fe"};

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