import React, { useEffect, useState } from "react";
import html2pdf from "html2pdf.js";

export default function SalaryRecords() {

const [records,setRecords] = useState([]);
const [selected,setSelected] = useState(null);


// Load salary slips from backend
const loadRecords = () => {

fetch("http://localhost:5000/salary/all")
.then(res=>res.json())
.then(data=>setRecords(data))
.catch(err=>console.log(err));

};

useEffect(()=>{
loadRecords();
},[]);


// View Slip
const viewSlip = (rec)=>{
setSelected(rec);
};


// Download PDF
const downloadPDF = ()=>{

const element = document.getElementById("saved-slip");

const opt = {
margin:5,
filename:"Salary_Slip.pdf",
html2canvas:{scale:2},
jsPDF:{unit:"mm",format:"a4",orientation:"portrait"}
};

html2pdf().set(opt).from(element).save();

};


return(

<div style={{padding:"40px"}}>

<h1 style={{
fontSize:"34px",
fontWeight:"800",
color:"#fff"
}}>
Saved Salary Slips
</h1>


<div
style={{
marginTop:"20px",
background:"#fff",
padding:"20px",
borderRadius:"12px",
border:"2px solid #d4a017"
}}
>

<table style={{
width:"100%",
borderCollapse:"collapse"
}}>

<thead>

<tr style={{background:"#FDF6E3"}}>

<th style={th}>Worker ID</th>
<th style={th}>Name</th>
<th style={th}>Designation</th>
<th style={th}>Salary Month</th>
<th style={th}>Net Salary</th>
<th style={th}>Actions</th>

</tr>

</thead>

<tbody>

{records.map((r)=>(
<tr key={r._id}>

<td style={td}>{r.workerId}</td>
<td style={td}>{r.name}</td>
<td style={td}>{r.designation}</td>
<td style={td}>{r.salaryMonth}</td>
<td style={td}>₹ {r.netSalary}</td>

<td style={td}>

<button
style={btn}
onClick={()=>viewSlip(r)}
>
View Slip
</button>

<button
style={{...btn,background:"#16a34a"}}
onClick={downloadPDF}
>
Download PDF
</button>

</td>

</tr>
))}

</tbody>

</table>

</div>


{/* Salary Slip Preview */}

{selected && (

<div
id="saved-slip"
style={{
marginTop:"40px",
background:"#fff",
padding:"35px",
borderRadius:"12px",
border:"3px solid #111",
width:"80%",
margin:"40px auto"
}}
>

<h2
style={{
textAlign:"center",
fontSize:"30px",
fontWeight:"bold",
marginBottom:"25px"
}}
>
Salary Slip – {selected.name} ({selected.designation})
</h2>


<table
style={{
width:"100%",
borderCollapse:"collapse",
fontSize:"16px"
}}
>

<tbody>

<tr>
<td style={label}>EMPLOYEE ID</td>
<td style={value}>{selected.workerId}</td>

<td style={label}>SALARY MONTH</td>
<td style={value}>{selected.salaryMonth}</td>
</tr>


<tr>
<td style={label}>NAME</td>
<td style={value}>{selected.name}</td>

<td style={label}>PAYMENT DATE</td>
<td style={value}>{selected.paymentDate}</td>
</tr>


<tr>
<td style={label}>DESIGNATION</td>
<td style={value}>{selected.designation}</td>

<td style={label}>BASIC SALARY</td>
<td style={value}>{selected.basicSalary}</td>
</tr>


<tr>
<td style={label}>PRESENT DAYS</td>
<td style={value}>{selected.presentDays}</td>

<td style={label}>OT HOURS</td>
<td style={value}>{selected.otHours}</td>
</tr>


<tr>
<td style={label}>ALLOWANCE</td>
<td style={value}>{selected.allowance}</td>

<td style={label}>ADVANCE</td>
<td style={value}>{selected.advance}</td>
</tr>


<tr>
<td style={value}></td>
<td style={value}></td>

<td style={label}>NET SALARY</td>
<td style={{...value,fontWeight:"bold"}}>
₹ {selected.netSalary}
</td>
</tr>

</tbody>

</table>

</div>

)}

</div>

);

}


// Table Header Style
const th = {
padding:"12px",
borderBottom:"2px solid #d4a017",
textAlign:"left"
};


// Table Cell Style
const td = {
padding:"12px",
borderBottom:"1px solid #eee"
};


// Button Style
const btn = {
padding:"6px 14px",
marginRight:"8px",
background:"#2563eb",
color:"#fff",
border:"none",
borderRadius:"6px",
cursor:"pointer"
};


// Salary Slip Label Style
const label = {
padding:"10px 14px",
border:"1px solid #000",
fontWeight:"600",
color:"#333"
};


// Salary Slip Value Style
const value = {
padding:"10px 14px",
border:"1px solid #000"
};