import React, { useState, useEffect } from "react";

export default function Tasks(){

const [tasks,setTasks] = useState([]);
const [workers,setWorkers] = useState([]);
const [showForm,setShowForm] = useState(false);
const [viewType,setViewType] = useState("today");
const [notification,setNotification] = useState("");

const [newTask,setNewTask] = useState({
taskName:"",
workerIds:[],
dueDate:""
});

const [adminComments,setAdminComments] = useState({});

/* ================= LOAD DATA ================= */

useEffect(()=>{

const loadTasks = () => {

fetch("http://localhost:5000/tasks/all")
.then(res=>res.json())
.then(data=>setTasks(data));

fetch("http://localhost:5000/api/worker/all")
.then(res=>res.json())
.then(data=>setWorkers(data));

};

loadTasks();

const interval = setInterval(loadTasks,5000);

return () => clearInterval(interval);

},[]);


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


/* ================= ASSIGN TASK ================= */

const handleAddTask = async()=>{

if(!newTask.taskName || !newTask.dueDate){
alert("Enter task name & due date");
return;
}

if(newTask.workerIds.length===0){
alert("Select workers");
return;
}

const createdTasks=[];
const workerNames=[];

for(let id of newTask.workerIds){

const worker = workers.find(w=>w.workerId===id);

workerNames.push(worker.name);

const payload={
workerId:worker.workerId,
workerName:worker.name,
designation:worker.designation,
task:newTask.taskName,
dueDate:newTask.dueDate,
progress:0,
progressDescription:"",
adminReview:"",
status:"Pending"
};

const res = await fetch("http://localhost:5000/tasks/create",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify(payload)
});

const data = await res.json();

createdTasks.push(data);

}

setTasks([...createdTasks,...tasks]);

setNotification(`Task "${newTask.taskName}" assigned`);

setTimeout(()=>setNotification(""),4000);

setShowForm(false);

setNewTask({
taskName:"",
workerIds:[],
dueDate:""
});

};


/* ================= SEND ADMIN COMMENT ================= */

const sendAdminComment = async(id)=>{

const comment = adminComments[id];

if(!comment){
alert("Select comment first");
return;
}

const task = tasks.find(t => t._id === id);

const res = await fetch(`http://localhost:5000/tasks/status/${id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
status: task.status,       // keep existing status
adminReview: comment       // send admin comment
})
});

const updated = await res.json();

setTasks(tasks.map(t => t._id===id ? updated : t));

setNotification("Comment sent to worker successfully");

setTimeout(()=>setNotification(""),3000);

};

/* ================= UPDATE STATUS ================= */

const updateStatus = async(id,status)=>{

const res = await fetch(`http://localhost:5000/tasks/status/${id}`,{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({status})
});

const updated = await res.json();

setTasks(tasks.map(t=>t._id===id?updated:t));

};


/* ================= STATUS COLOR ================= */

const statusColor=(status)=>{

if(status==="Pending") return "#ef4444";
if(status==="In Progress") return "#f59e0b";
if(status==="Completed") return "#10b981";


return "#ccc";

};


/* ================= PROGRESS COLOR ================= */

const progressColor=(p)=>{
if(p<=30) return "#ef4444";
if(p<=70) return "#f59e0b";
return "#10b981";
};


/* ================= SUMMARY ================= */

const total = filteredTasks.length;
const pending = filteredTasks.filter(t=>t.status==="Pending").length;
const progress = filteredTasks.filter(t=>t.status==="In Progress").length;
const completed = filteredTasks.filter(t=>t.status==="Completed").length;


/* ================= UI ================= */

return(

<div style={page}>

<h1 style={title}>Admin Task Dashboard</h1>

{notification &&(
<div style={notify}>✅ {notification}</div>
)}

{/* SUMMARY */}

<div style={summaryContainer}>

<div style={card}><h3>Total</h3><p>{total}</p></div>
<div style={cardYellow}><h3>Pending</h3><p>{pending}</p></div>
<div style={cardBlue}><h3>In Progress</h3><p>{progress}</p></div>
<div style={cardGreen}><h3>Completed</h3><p>{completed}</p></div>

</div>


{/* ================= TABLE ================= */}

<div style={tableCard}>

<table style={table}>

<thead>

<tr>
<th style={th}>Worker</th>
<th style={th}>Task</th>
<th style={th}>Due Date</th>
<th style={th}>Progress</th>
<th style={th}>Worker Update</th>
<th style={th}>Admin Comment</th>
<th style={th}>Status</th>
<th style={th}>Action</th>
</tr>

</thead>

<tbody>

{filteredTasks.map((t,i)=>(

<tr key={i}>

<td style={td}>
<b>{t.workerName}</b><br/>
<small>{t.designation}</small>
</td>

<td style={td}>{t.task}</td>

<td style={td}>{t.dueDate}</td>

<td style={td}>

<div style={progressBar}>

<div style={{
width:`${t.progress}%`,
background:progressColor(t.progress),
color:"#fff",
borderRadius:6
}}>
{t.progress}%
</div>

</div>

</td>

{/* WORKER UPDATE */}

<td style={td}>
{t.progressDescription ? t.progressDescription : "-"}
</td>

{/* ADMIN COMMENT */}

<td style={td}>

<select
style={select}
onChange={(e)=>setAdminComments({
...adminComments,
[t._id]:e.target.value
})}
>

<option value="">Select</option>
<option>Good Progress </option>
<option>Needs Improvement </option>
<option>Please Update Details </option>
<option>Excellent Work </option>

</select>

<br/><br/>

<button
style={sendBtn}
onClick={()=>sendAdminComment(t._id)}
>
Send
</button>

</td>


{/* STATUS */}

<td style={{...td,color:statusColor(t.status),fontWeight:700}}>
{t.status}
</td>


{/* ACTION */}

<td style={td}>

<select
value={t.status}
onChange={(e)=>updateStatus(t._id,e.target.value)}
style={{
...select,
background:statusColor(t.status),
color:"#fff",
fontWeight:700
}}
>

<option>Pending</option>
<option>In Progress</option>
<option>Completed</option>


</select>

</td>

</tr>

))}

</tbody>

</table>

</div>


{/* ================= FORM ================= */}

{showForm &&(

<div style={formCard}>

<h3>Create Task</h3>

<input
placeholder="Task Name"
style={input}
value={newTask.taskName}
onChange={(e)=>setNewTask({...newTask,taskName:e.target.value})}
/>

<h4>Select Workers</h4>

<div style={workerList}>

{workers.map(w=>(

<label key={w.workerId} style={{display:"block"}}>

<input
type="checkbox"
checked={newTask.workerIds.includes(w.workerId)}
onChange={(e)=>{

if(e.target.checked){

setNewTask({
...newTask,
workerIds:[...newTask.workerIds,w.workerId]
});

}else{

setNewTask({
...newTask,
workerIds:newTask.workerIds.filter(id=>id!==w.workerId)
});

}

}}
/>

{w.name} ({w.designation})

</label>

))}

</div>

<input
type="date"
style={input}
value={newTask.dueDate}
onChange={(e)=>setNewTask({...newTask,dueDate:e.target.value})}
/>

<button style={goldBtn} onClick={handleAddTask}>
Save Task
</button>

</div>

)}


{/* ================= BOTTOM PANEL ================= */}

<div style={bottomBar}>

<button style={goldBtn} onClick={()=>setShowForm(true)}>Assign Task</button>

<button style={blueBtn} onClick={()=>setViewType("today")}>Today's Tasks</button>

<button style={blueBtn} onClick={()=>setViewType("week")}>This Week</button>

<button style={blueBtn} onClick={()=>setViewType("all")}>All Tasks</button>

</div>

</div>

);

}


/* ================= STYLES ================= */

const page={padding:40,fontFamily:"Segoe UI",background:"#F3F6FB",minHeight:"100vh"};
const title={fontSize:34,fontWeight:800,marginBottom:25};

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

const goldBtn={
background:"linear-gradient(135deg,#d4a017,#b8960f)",
border:"none",
padding:"10px 18px",
borderRadius:10,
fontWeight:700,
cursor:"pointer"
};

const blueBtn={
background:"#0288D1",
color:"#fff",
border:"none",
padding:"10px 18px",
borderRadius:10,
fontWeight:600,
cursor:"pointer"
};

const sendBtn={
background:"#16a34a",
color:"#fff",
border:"none",
padding:"6px 12px",
borderRadius:6,
cursor:"pointer"
};

const select={padding:6,borderRadius:6};

const summaryContainer={display:"flex",gap:20,marginBottom:30};

const card={flex:1,background:"white",padding:20,borderRadius:14,textAlign:"center",border:"2px solid #d4a017"};

const cardGreen={...card,background:"#dcfce7"};
const cardYellow={...card,background:"#fef9c3"};
const cardBlue={...card,background:"#e0f2fe"};

const tableCard={background:"white",padding:18,borderRadius:14,border:"2px solid #d4a017",overflowX:"auto"};

const table={width:"100%",borderCollapse:"collapse"};

const th={padding:12,textAlign:"center",fontWeight:700,borderBottom:"2px solid #d4a017",background:"#F3F6FB"};

const td={padding:10,textAlign:"center",borderBottom:"1px solid #eee"};

const progressBar={width:120,background:"#ddd",borderRadius:6,margin:"auto"};

const formCard={background:"#fff",padding:20,borderRadius:12,width:350,marginTop:30,border:"2px solid #d4a017"};

const workerList={maxHeight:150,overflowY:"auto",border:"1px solid #ccc",padding:10,marginBottom:10};

const input={width:"100%",padding:8,marginBottom:10};