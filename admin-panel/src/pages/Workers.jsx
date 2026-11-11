import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Workers() {

const factories = ["Bhiwandi", "Dombivali"];
const sites = ["Dadar", "Goa", "Pune"];

const [workerList,setWorkerList] = useState([]);
const [search,setSearch] = useState("");

const [form,setForm] = useState({
workerId:"",
name:"",
designation:"",
basicSalary:"",
factory:"Bhiwandi",
site:"Dadar"
});

const [editingId,setEditingId] = useState(null);


// LOAD WORKERS FROM BACKEND
const loadWorkers = () => {

fetch("http://localhost:5000/workers/all")
.then(res=>res.json())
.then(data=>setWorkerList(data));

};

useEffect(()=>{
loadWorkers();
},[]);


// SEARCH FILTER
const filtered = workerList.filter(
(w)=>
w.name?.toLowerCase().includes(search.toLowerCase()) ||
w.designation?.toLowerCase().includes(search.toLowerCase()) ||
w.factory?.toLowerCase().includes(search.toLowerCase()) ||
w.site?.toLowerCase().includes(search.toLowerCase())
);


// ADD / UPDATE WORKER
const handleSubmit = async () => {

if(!form.name || !form.designation) return;

try{

if(editingId){

await fetch(`http://localhost:5000/workers/${editingId}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
});

setEditingId(null);

}else{

await fetch("http://localhost:5000/workers/save",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
});

}

loadWorkers();

setForm({
workerId:"",
name:"",
designation:"",
basicSalary:"",
factory:"Bhiwandi",
site:"Dadar"
});

}catch(err){

console.log(err);

}

};


// EDIT WORKER
const handleEdit = (worker) => {

setForm({
workerId:worker.workerId || "",
name:worker.name || "",
designation:worker.designation || "",
basicSalary:worker.basicSalary || "",
factory:worker.factory || "Bhiwandi",
site:worker.site || "Dadar"
});

setEditingId(worker._id);

};


// DELETE WORKER
const handleDelete = async (id) => {

if(!window.confirm("Delete this worker?")) return;

await fetch(`http://localhost:5000/workers/${id}`,{
method:"DELETE"
});

loadWorkers();

};


return(

<div style={{color:"#000"}}>

{/* HEADER */}

<div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>

<div>

<h1 style={{fontSize:36,fontWeight:800,color:"#fff"}}>
Worker Details
</h1>

<p style={{color:"#d4a017",fontSize:17}}>
Manage worker profiles, factory & site assignments
</p>

</div>

<input
placeholder="Search worker / role / site / factory"
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{
padding:"8px 14px",
borderRadius:10,
border:"2px solid #d4a017",
width:260,
fontSize:14,
outline:"none"
}}
/>

</div>


{/* FORM */}

<div
style={{
marginTop:22,
background:"white",
padding:18,
borderRadius:14,
border:"2px solid #d4a017",
boxShadow:"0 10px 25px rgba(0,0,0,0.1)"
}}
>

<h3 style={{marginBottom:15,color:"#0A0F1F",fontWeight:700}}>
{editingId ? "Edit Worker" : "Add Worker"}
</h3>


<div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:15}}>

<input
placeholder="Worker ID"
value={form.workerId}
onChange={(e)=>setForm({...form,workerId:e.target.value})}
style={input}
/>

<input
placeholder="Name"
value={form.name}
onChange={(e)=>setForm({...form,name:e.target.value})}
style={input}
/>

<input
placeholder="Designation"
value={form.designation}
onChange={(e)=>setForm({...form,designation:e.target.value})}
style={input}
/>

<input
placeholder="Salary"
value={form.basicSalary}
onChange={(e)=>setForm({...form,basicSalary:e.target.value})}
style={input}
/>

<select
value={form.factory}
onChange={(e)=>setForm({...form,factory:e.target.value})}
style={input}
>
{factories.map((f)=>(
<option key={f}>{f}</option>
))}
</select>

<select
value={form.site}
onChange={(e)=>setForm({...form,site:e.target.value})}
style={input}
>
{sites.map((s)=>(
<option key={s}>{s}</option>
))}
</select>

</div>


<button
onClick={handleSubmit}
style={{
marginTop:18,
padding:"10px 18px",
background:"linear-gradient(135deg, #d4a017, #b8960f)",
color:"#101820",
borderRadius:10,
border:"none",
fontWeight:700,
cursor:"pointer"
}}
>

{editingId ? "Update Worker" : "Add Worker"}

</button>

</div>


{/* TABLE */}

<div
style={{
marginTop:22,
background:"white",
padding:18,
borderRadius:14,
border:"2px solid #d4a017",
boxShadow:"0 10px 25px rgba(0,0,0,0.1)"
}}
>

<table style={{width:"100%",borderCollapse:"collapse"}}>

<thead>

<tr style={{background:"#F3F6FB"}}>

<th style={th}>Worker ID</th>
<th style={th}>Name</th>
<th style={th}>Designation</th>
<th style={th}>Factory</th>
<th style={th}>Site</th>
<th style={th}>Salary</th>
<th style={th}>Actions</th>

</tr>

</thead>

<tbody>

{filtered.map((w)=>(

<tr key={w._id}>

<td style={td}>{w.workerId}</td>
<td style={td}>{w.name}</td>
<td style={td}>{w.designation}</td>
<td style={td}>{w.factory || "-"}</td>
<td style={td}>{w.site || "-"}</td>
<td style={td}>₹{w.basicSalary}</td>

<td style={td}>

<button
style={actionBtn}
onClick={()=>handleEdit(w)}
>
Edit
</button>

<button
style={{...actionBtn,background:"#ff7675"}}
onClick={()=>handleDelete(w._id)}
>
Delete
</button>

<Link
to="/salary-slip"
style={{
display:"inline-block",
padding:"8px 16px",
background:"linear-gradient(135deg, #d4a017, #b8960f)",
color:"#101820",
borderRadius:10,
textDecoration:"none",
fontWeight:700,
marginTop:8
}}
>
Generate Salary Slip
</Link>

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

);

}


const input={
padding:"9px 12px",
borderRadius:10,
border:"1.5px solid #d4a017",
width:"100%",
fontSize:14
};

const th={
padding:12,
textAlign:"left",
fontWeight:700,
color:"#101820",
background:"#FDF6E3",
borderBottom:"2px solid #d4a017"
};

const td={
padding:12,
borderBottom:"1px solid #f1f1f1"
};

const actionBtn={
padding:"7px 12px",
marginRight:8,
borderRadius:8,
border:"none",
background:"linear-gradient(135deg, #0288D1, #01579B)",
color:"white",
fontWeight:600,
cursor:"pointer"
};