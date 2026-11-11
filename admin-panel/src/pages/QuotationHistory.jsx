import React,{useEffect,useState} from "react";
import {useNavigate,useLocation} from "react-router-dom";

export default function QuotationHistory(){

const nav = useNavigate();
const location = useLocation();

const [rows,setRows] = useState([]);
const [search,setSearch] = useState("");

/* LOAD QUOTATIONS */

const loadQuotations = () => {

fetch("http://localhost:5000/quotation/all")
.then(res => res.json())
.then(data => setRows(data));

};

/* LOAD WHEN PAGE OPENS */

useEffect(()=>{

loadQuotations();

},[location]);

/* DELETE */

const deleteQuotation = async (id) => {

if(!window.confirm("Delete this quotation?")) return;

try{

const res = await fetch(`http://localhost:5000/quotation/${id}`,{
method:"DELETE"
});

const data = await res.json();

if(data.success){

// remove instantly from UI
setRows(prev => prev.filter(q => q._id !== id));

}

}catch(err){

console.log("Delete error:", err);

}

};

/* SEARCH FILTER */

const filtered = rows.filter(q =>
q.client?.toLowerCase().includes(search.toLowerCase())
);

return(

<div style={page}>

<h1 style={title}>Quotation History</h1>

<input
placeholder="Search by client..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={searchBox}
/>

<table style={table}>

<thead>

<tr style={thead}>

<th style={th}>Date</th>
<th style={th}>Ref No</th>
<th style={th}>Client</th>
<th style={th}>Project</th>
<th style={th}>Total</th>
<th style={th}>Actions</th>

</tr>

</thead>

<tbody>

{filtered.map(q=>(

<tr key={q._id} style={tr}>

<td style={td}>{q.date}</td>
<td style={td}>{q.refNo}</td>
<td style={td}>{q.client}</td>
<td style={td}>{q.project}</td>
<td style={td}>₹ {q.total?.toLocaleString()}</td>

<td style={td}>

<button
style={btn}
onClick={()=>nav(`/quotation/view/${q._id}`)}
>
View
</button>

<button
style={editBtn}
onClick={()=>nav(`/quotation/edit/${q._id}`)}
>
Edit
</button>

<button
style={deleteBtn}
onClick={()=>deleteQuotation(q._id)}
>
Delete
</button>

</td>

</tr>

))}

</tbody>

</table>

</div>

)

}

/* UI */

const page={
padding:"40px 40px 60px",
fontFamily:"Segoe UI",
background:"#f5f7fb",
minHeight:"100vh"
}

const title={
fontSize:30,
fontWeight:800,
marginBottom:20
}

const searchBox={
padding:10,
width:300,
marginBottom:20,
borderRadius:6,
border:"1px solid #ccc"
}

const table={
width:"100%",
borderCollapse:"collapse",
background:"#fff",
boxShadow:"0 6px 20px rgba(0,0,0,0.1)"
}

const thead={
background:"#1e293b",
color:"#fff"
}

const th={
padding:14,
textAlign:"left"
}

const td={
padding:14
}

const tr={
borderBottom:"1px solid #e5e7eb"
}

const btn={
padding:"6px 12px",
marginRight:8,
background:"#2563eb",
color:"#fff",
border:"none",
borderRadius:6,
cursor:"pointer"
}

const editBtn={
padding:"6px 12px",
marginRight:8,
background:"#16a34a",
color:"#fff",
border:"none",
borderRadius:6,
cursor:"pointer"
}

const deleteBtn={
padding:"6px 12px",
background:"crimson",
color:"#fff",
border:"none",
borderRadius:6,
cursor:"pointer"
}