import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, MapPin, CheckCircle, ClipboardCheck, AlertTriangle } from "lucide-react";

import {
PieChart,
Pie,
Cell,
Tooltip,
ResponsiveContainer,
BarChart,
Bar,
XAxis,
YAxis,
LineChart,
Line,
CartesianGrid
} from "recharts";

export default function Dashboard(){

const nav = useNavigate();

const [workers,setWorkers] = useState([]);
const [tasks,setTasks] = useState([]);
const [attendance,setAttendance] = useState([]);
const [weeklyTrend,setWeeklyTrend] = useState([]);

const [loading,setLoading] = useState(true);

useEffect(()=>{

async function loadData(){

try{

const workerRes = await fetch("http://localhost:5000/api/worker/all");
const workersData = await workerRes.json();

const taskRes = await fetch("http://localhost:5000/tasks/all");
const tasksData = await taskRes.json();

const attendanceRes = await fetch("http://localhost:5000/attendance/admin-today");
const attendanceData = await attendanceRes.json();

const weekRes = await fetch("http://localhost:5000/attendance/week");
const weekData = await weekRes.json();

setWorkers(workersData || []);
setTasks(tasksData || []);
setAttendance(attendanceData || []);

/* WEEK TREND */

const trendMap = {};

weekData.forEach(a=>{

const date = new Date(a.date);
const day = date.toLocaleDateString("en-US",{weekday:"short"});

if(!trendMap[day]) trendMap[day]=0;

if(a.status==="Present" || a.status==="Late"){
trendMap[day]++;
}

});

const trendArray = Object.keys(trendMap).map(day=>({
day,
present:trendMap[day]
}));

setWeeklyTrend(trendArray);

}catch(err){

console.error("Dashboard error:",err);

}finally{

setLoading(false);

}

}

loadData();

},[]);


/* LOADING */

if(loading){
return(
<div style={{padding:"40px",color:"#fff"}}>
<h2>Loading Dashboard...</h2>
</div>
)
}


/* KPI CALCULATIONS */

const totalWorkers = workers.length;

const todayPresent =
attendance.filter(a =>
a.status==="Present" || a.status==="Late"
).length;

const activeTasks =
tasks.filter(t=>t.status!=="Completed").length;

const completedTasks =
tasks.filter(t=>t.status==="Completed").length;

const attendanceRate =
totalWorkers ? Math.round((todayPresent/totalWorkers)*100) : 0;

const overdueTasks =
tasks.filter(t =>
new Date(t.dueDate) < new Date() && t.status!=="Completed"
).length;


/* CHART DATA */

const attendanceChart=[
{name:"Present",value:todayPresent},
{name:"Absent",value:totalWorkers - todayPresent}
];

const taskChart=[
{name:"Active",value:activeTasks},
{name:"Completed",value:completedTasks}
];

const taskStatusData=[
{name:"Completed",value:tasks.filter(t=>t.status==="Completed").length},
{name:"In Progress",value:tasks.filter(t=>t.status==="In Progress").length},
{name:"Pending",value:tasks.filter(t=>t.status==="Pending").length}
];

const COLORS=["#16a34a","#dc2626"];


/* STYLES */

const cardStyle={
background:"#f5f7fb",
borderRadius:"18px",
padding:"22px",
boxShadow:"0 12px 30px rgba(0,0,0,0.25)",
borderLeft:"6px solid #d4a017",
cursor:"pointer"
};

const statNumberStyle={
fontSize:"28px",
fontWeight:"800",
color:"#1f4fb2"
};

const sectionStyle={
background:"#f5f7fb",
borderRadius:"18px",
padding:"22px",
boxShadow:"0 10px 25px rgba(0,0,0,0.2)",
borderTop:"4px solid #d4a017"
};


/* UI */

return(

<div
style={{
minHeight:"100vh",
padding:"32px",
background:"linear-gradient(135deg,#1f4fb2 0%,#0e2a52 100%)"
}}
>

<h1 style={{fontSize:"36px",color:"#fff",fontWeight:"800"}}>
Workforce Analytics Dashboard
</h1>

<p style={{color:"#d4a017",marginTop:"6px"}}>
SMART WORKFORCE MANAGEMENT
</p>


{/* ALERT */}

{overdueTasks>0 && (

<div style={{
marginTop:"20px",
background:"#fff3cd",
padding:"15px",
borderRadius:"10px",
display:"flex",
alignItems:"center",
gap:"10px"
}}>

<AlertTriangle color="orange"/>

<b>{overdueTasks} tasks are overdue!</b>

</div>

)}


{/* KPI CARDS */}

<div
style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",
gap:"24px",
marginTop:"35px"
}}
>

<div style={cardStyle} onClick={()=>nav("/workers")}>
<Users/>
<h3>Total Workers</h3>
<h2 style={statNumberStyle}>{totalWorkers}</h2>
</div>

<div style={cardStyle} onClick={()=>nav("/Tasks")}>
<MapPin/>
<h3>Active Tasks</h3>
<h2 style={statNumberStyle}>{activeTasks}</h2>
</div>

<div style={cardStyle} onClick={()=>nav("/admin-attendance")}>
<CheckCircle/>
<h3>Today's Present</h3>
<h2 style={statNumberStyle}>{todayPresent}</h2>
</div>

<div style={cardStyle} onClick={()=>nav("/Tasks")}>
<ClipboardCheck/>
<h3>Completed Tasks</h3>
<h2 style={statNumberStyle}>{completedTasks}</h2>
</div>

<div style={cardStyle}>
<h3>Attendance Rate</h3>
<h2 style={statNumberStyle}>{attendanceRate}%</h2>
</div>

</div>


{/* CHART ROW 1 */}

<div
style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"24px",
marginTop:"40px"
}}
>

{/* ATTENDANCE */}

<div style={sectionStyle}>

<h2>Attendance Analytics</h2>

<div style={{display:"flex",gap:"40px",alignItems:"center"}}>

<ResponsiveContainer width="50%" height={250}>
<PieChart>
<Pie data={attendanceChart} dataKey="value" outerRadius={90}>
{attendanceChart.map((entry,index)=>(
<Cell key={index} fill={COLORS[index]} />
))}
</Pie>
<Tooltip/>
</PieChart>
</ResponsiveContainer>

<div>

<p><b>Total Workers:</b> {totalWorkers}</p>

<p style={{color:"#16a34a"}}>
<b>Present:</b> {todayPresent}
</p>

<p style={{color:"#dc2626"}}>
<b>Absent:</b> {totalWorkers - todayPresent}
</p>

<p>
<b>Attendance Rate:</b> {attendanceRate}%
</p>

</div>

</div>

</div>


{/* TASK COMPLETION */}

<div style={sectionStyle}>

<h2>Task Completion</h2>

<ResponsiveContainer width="100%" height={250}>

<BarChart data={taskChart}>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="value" fill="#1f4fb2"/>
</BarChart>

</ResponsiveContainer>

</div>

</div>


{/* CHART ROW 2 */}

<div
style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"24px",
marginTop:"24px"
}}
>

{/* TASK STATUS */}

<div style={sectionStyle}>

<h2>Task Status Distribution</h2>

<div style={{display:"flex",gap:"40px",alignItems:"center"}}>

<ResponsiveContainer width="50%" height={250}>

<PieChart>

<Pie data={taskStatusData} dataKey="value" outerRadius={90}>

<Cell fill="#16a34a"/>
<Cell fill="#d4a017"/>
<Cell fill="#dc2626"/>

</Pie>

<Tooltip/>

</PieChart>

</ResponsiveContainer>

<div>

<p style={{color:"#16a34a"}}>
<b>Completed:</b> {tasks.filter(t=>t.status==="Completed").length}
</p>

<p style={{color:"#d4a017"}}>
<b>In Progress:</b> {tasks.filter(t=>t.status==="In Progress").length}
</p>

<p style={{color:"#dc2626"}}>
<b>Pending:</b> {tasks.filter(t=>t.status==="Pending").length}
</p>

<p>
<b>Total Tasks:</b> {tasks.length}
</p>

</div>

</div>

</div>


{/* WEEKLY TREND */}

<div style={sectionStyle}>

<h2>Weekly Attendance Trend</h2>

<ResponsiveContainer width="100%" height={250}>

<LineChart data={weeklyTrend}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="day"/>
<YAxis/>
<Tooltip/>

<Line
type="monotone"
dataKey="present"
stroke="#16a34a"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

</div>

</div>

);

}