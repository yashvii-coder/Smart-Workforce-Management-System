// src/pages/Quotation.jsx
import React, { useState, useMemo, useEffect } from "react";
import html2pdf from "html2pdf.js";
import LOGO from "../assets/LOGO1.png";
import { gfrcItems } from "../data/itemsData";
import { useNavigate , useLocation} from "react-router-dom";



export default function Quotation() {
  const navigate = useNavigate();


  // ---- inline styles used across component ----
  const input = {
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
    marginTop: 4,
    boxSizing: "border-box",
  };

  const miniInput = {
    width: 80,
    padding: 6,
    boxSizing: "border-box",
  };

 const btn = {
  padding: "10px 18px",
  background: "linear-gradient(135deg, #d4a017, #b8960f)",
  color: "#101820",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 700,
  boxShadow: "0 6px 14px rgba(0,0,0,0.3)",
};



  const smallBtn = {
  padding: "7px 12px",
  background: "linear-gradient(135deg, #0288D1, #01579B)",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
};


  // ---- state ----
  const [showPreview, setShowPreview] = useState(false);
  // items array in table
 
const location = useLocation();
const products = location.state?.products || [];

const [items, setItems] = useState([]);

useEffect(() => {

  if (products.length > 0) {

    const newItems = products.map((p) => ({
      id: Date.now() + Math.random(),
      code: p.name.replace(/\s/g, "-").toUpperCase(),
      name: p.name,
      qty: 1,
      unit: "Nos",
      rate: 0,
      amount: 0
    }));

    setItems(newItems);
  }

}, [products]);

// saved flag (prevents duplicate saving)
const [saved, setSaved] = useState(false);

// reset save flag when items change
useEffect(()=>{
  setSaved(false);
},[items]);

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    refNo: "PP-kal/grc/29092025 (R1)",
    client: "ZHAFAR PATEL",
    project: "GFRC FAÇADE",
    kindAttn: "MR. MAZHAR PATEL",
    note:
      "Quotation for GFRC Facade with supply material and installation as per your sharing CAD Drawings.",
    transport: 75000,
    gstPercent: 18,
    round: true,
  });


  // dropdown selection
  const [selectedItemCode, setSelectedItemCode] = useState("");

  // manual add inputs
  const [manualName, setManualName] = useState("");
  const [manualQty, setManualQty] = useState("");
  const [manualUnit, setManualUnit] = useState("");
  const [manualRate, setManualRate] = useState("");

  // ---- handlers ----
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Add item using dropdown (predefined item)
  const addItemFromDropdown = () => {
    if (!selectedItemCode) return;
    const selected = gfrcItems.find((x) => x.code === selectedItemCode);
    if (!selected) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        code: selected.code,
        name: selected.name,
        qty: Number(selected.defaultQty || 1),
        unit: selected.unit || "",
        rate: Number(selected.rate || 0),
        amount: Number(selected.rate || 0) * Number(selected.defaultQty || 1),
      },
    ]);
    setSelectedItemCode("");
  };
//to add manual item
function generateItemCode(name){

let clean = name
.toUpperCase()
.replace(/['"]/g,"")
.replace(/[^A-Z0-9\s]/g," ");

let words = clean.split(" ").filter(w => w.length > 2);

let numbers = clean.match(/\d+/g) || [];

// take first 3 important words
let wordPart = words.slice(0,3).join("-");

// add dimensions if present
let numberPart = numbers.join("-");

if(numberPart){
return `${wordPart}-${numberPart}`;
}

return wordPart;

}
  // Add manual item
  const addManualItem = () => {

if (!manualName || !manualQty || !manualRate) {
alert("Please enter Name, Qty and Rate for manual item.");
return;
}

const qtyNum = Number(manualQty);
const rateNum = Number(manualRate);

// smart auto code
const itemCode = generateItemCode(manualName);

setItems((prev) => [
...prev,
{
id: Date.now(),
code: itemCode,
name: manualName,
qty: qtyNum,
unit: manualUnit || "",
rate: rateNum,
amount: qtyNum * rateNum,
},
]);

setManualName("");
setManualQty("");
setManualUnit("");
setManualRate("");

};

  const removeItem = (id) => setItems((p) => p.filter((i) => i.id !== id));

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? {
              ...it,
              [field]:
                field === "name" || field === "unit" ? value : Number(value || 0),
              amount:
                field === "qty"
                  ? Number(value || 0) * it.rate
                  : field === "rate"
                  ? it.qty * Number(value || 0)
                  : it.amount,
            }
          : it
      )
    );
  };

  const clearItems = () => setItems([]);

  // ---- computations ----
  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.amount || 0), 0),
    [items]
  );

  const gst = useMemo(
    () => (subtotal * Number(form.gstPercent)) / 100,
    [subtotal, form.gstPercent]
  );

  const totalBeforeRound = subtotal + Number(form.transport || 0) + gst;

  const finalTotal = form.round
    ? Math.round(totalBeforeRound)
    : Number(totalBeforeRound.toFixed(2));

     const saveQuotation = async () => {

try{

const res = await fetch("http://localhost:5000/quotation/save",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

...form,
items,
subtotal,
transport:form.transport,
gst,
gstPercent:form.gstPercent,
total:finalTotal

})

});

const data = await res.json();

if(data.success){
alert("Quotation Saved Successfully");
}

}catch(err){

console.log(err);

}

};

const handleGenerateQuotation = () => {

setShowPreview(true);   // only preview

};
  // number to words (Indian)
  function numberToWordsIndian(num) {
    if (!num || Number(num) === 0) return "ZERO";
    num = Math.abs(Number(Math.round(num)));
    const a = [
      "",
      "ONE",
      "TWO",
      "THREE",
      "FOUR",
      "FIVE",
      "SIX",
      "SEVEN",
      "EIGHT",
      "NINE",
      "TEN",
      "ELEVEN",
      "TWELVE",
      "THIRTEEN",
      "FOURTEEN",
      "FIFTEEN",
      "SIXTEEN",
      "SEVENTEEN",
      "EIGHTEEN",
      "NINETEEN",
    ];
    const b = [
      "",
      "",
      "TWENTY",
      "THIRTY",
      "FORTY",
      "FIFTY",
      "SIXTY",
      "SEVENTY",
      "EIGHTY",
      "NINETY",
    ];
    function twoDigit(n) {
      if (n < 20) return a[n];
      return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
    }
    function threeDigit(n) {
      return (
        (n > 99 ? a[Math.floor(n / 100)] + " HUNDRED " : "") +
        (n % 100 !== 0 ? twoDigit(n % 100) : "")
      );
    }
    let result = "";
    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const hundred = num % 1000;
    if (crore) result += threeDigit(crore) + " CRORE ";
    if (lakh) result += threeDigit(lakh) + " LAKH ";
    if (thousand) result += threeDigit(thousand) + " THOUSAND ";
    if (hundred) result += threeDigit(hundred);
    return result.replace(/\s+/g, " ").trim();
  }


  // ---- PDF generation ----
  const generatePDF = () => {
    const element = document.getElementById("pdf-wrapper");
    if (!element) return alert("PDF wrapper not found!");

    // html2pdf options tuned for two A4 pages, zero margins, high fidelity
    const opt = {
      margin: 0,
      filename: `Quotation_${form.refNo || "quotation"}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        letterRendering: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["css", "legacy"],
      },
    };

    // Single call (clean)
    html2pdf().set(opt).from(element).save();
  };

  // ---- final JSX ----
  return (
    <div
  style={{
    padding: 24,
    maxWidth: 1200,
    margin: "0 auto",
    background: "linear-gradient(180deg, #0E2A52 0%, #081A33 100%)",
    minHeight: "100vh",
    borderRadius: 16,
  }}
>
  <h1
    style={{
      fontSize: 30,
      fontWeight: 800,
      marginBottom: 18,
      color: "#F4B000",
      letterSpacing: 0.5,
    }}
  >
    Quotation Builder
  </h1>
  <button
onClick={()=>navigate("/quotation/history")}
style={{...btn, marginTop:-6}}   // moves button slightly up
>
View History
</button>


      {/* ========== FORM (unchanged UI) ========== */}
<div
  style={{
    background: "#ffffff",
    padding: 20,
    borderRadius: 14,
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    border: "2px solid #d4a017",
    color: "#000",
  }}
>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontWeight: 700, color: "#101820" }}>Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} style={input} />
          </div>

          <div>
            <label style={{ fontWeight: 700, color: "#101820" }}>Ref No.</label>
            <input name="refNo" value={form.refNo} onChange={handleChange} style={input} />
          </div>

          <div>
           <label style={{ fontWeight: 700, color: "#101820" }}>Client</label>
            <input name="client" value={form.client} onChange={handleChange} style={input} />
          </div>

          <div>
           <label style={{ fontWeight: 700, color: "#101820" }}>Project</label>
            <input name="project" value={form.project} onChange={handleChange} style={input} />
          </div>

          <div>
            <label style={{ fontWeight: 700, color: "#101820" }}>Kind Attn</label>
            <input name="kindAttn" value={form.kindAttn} onChange={handleChange} style={input} />
          </div>

          <div>
            <label style={{ fontWeight: 700, color: "#101820" }}>Subject / Note</label>
            <textarea name="note" value={form.note} onChange={handleChange} style={{ ...input, height: 80 }} />
          </div>
        </div>

        {/* ITEMS SECTION (Dropdown + Manual Entry) */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block" }}>Select Items (from list)</label>
              <div style={{ display: "flex", gap: 8 }}>
                <select style={{ flex: 1, padding: 8 }} value={selectedItemCode} onChange={(e) => setSelectedItemCode(e.target.value)}>
                  <option value="">-- choose item --</option>
                  {gfrcItems.map((it) => (
                    <option key={it.code} value={it.code}>
                      {it.code} — {it.name}
                    </option>
                  ))}
                </select>
                <button onClick={addItemFromDropdown} style={smallBtn}>Add</button>
                <button onClick={clearItems} style={{ ...smallBtn, background: "crimson" }}>Clear All</button>
              </div>
            </div>

            {/* MANUAL ADD */}
            <div style={{ width: 280 }}>
              <label style={{ display: "block" }}>Manual add (Name, Qty, Unit, Rate)</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <input placeholder="Item name" value={manualName} onChange={(e) => setManualName(e.target.value)} style={{ ...input, marginTop: 0 }} />
                <input placeholder="Qty" value={manualQty} onChange={(e) => setManualQty(e.target.value)} style={{ ...input, marginTop: 0 }} />
                <input placeholder="Unit" value={manualUnit} onChange={(e) => setManualUnit(e.target.value)} style={{ ...input, marginTop: 0 }} />
                <input placeholder="Rate" value={manualRate} onChange={(e) => setManualRate(e.target.value)} style={{ ...input, marginTop: 0 }} />
              </div>
              <div style={{ marginTop: 8, textAlign: "right" }}>
                <button onClick={addManualItem} style={{ ...smallBtn, marginRight: 6 }}>Add Manual</button>
              </div>
            </div>
          </div>
        </div>

        {/* ITEMS TABLE */}
<div
  style={{
    marginTop: 14,
    borderRadius: 10,
    overflow: "hidden",
    border: "1.5px solid #d4a017",
  }}
>
          <table style={{ width: "100%", borderCollapse: "collapse" }} border="1">
            <thead>
<tr style={{ background: "#F4F6FA", color: "#101820" }}>
                <th style={{ padding: 8 }}>Sl</th>
                <th style={{ padding: 8 }}>Code</th>
                <th style={{ padding: 8 }}>Particulars</th>
                <th style={{ padding: 8 }}>Qty</th>
                <th style={{ padding: 8 }}>Unit</th>
                <th style={{ padding: 8 }}>Rate</th>
                <th style={{ padding: 8 }}>Amount</th>
                <th style={{ padding: 8 }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 20 }}>No items added yet</td>
                </tr>
              )}

              {items.map((it, idx) => (
                <tr key={it.id}>
                  <td style={{ padding: 8, textAlign: "center" }}>{idx + 1}</td>
                  <td style={{ padding: 8 }}>{it.code}</td>
                  <td style={{ padding: 8 }}>
                    <input value={it.name} onChange={(e) => updateItem(it.id, "name", e.target.value)} style={{ width: "100%", padding: 6, boxSizing: "border-box" }} />
                  </td>

                  <td style={{ padding: 8 }}>
                    <input type="number" value={it.qty} onChange={(e) => updateItem(it.id, "qty", e.target.value)} style={miniInput} />
                  </td>

                  <td style={{ padding: 8 }}>
                    <input value={it.unit} onChange={(e) => updateItem(it.id, "unit", e.target.value)} style={{ width: 90, padding: 6 }} />
                  </td>

                  <td style={{ padding: 8 }}>
                    <input type="number" value={it.rate} onChange={(e) => updateItem(it.id, "rate", e.target.value)} style={miniInput} />
                  </td>

                  <td style={{ padding: 8, textAlign: "right" }}>₹ {Number(it.amount || 0).toLocaleString()}</td>

                  <td style={{ padding: 8, textAlign: "center" }}>
                    <button onClick={() => removeItem(it.id)} style={{ ...smallBtn, background: "crimson" }}>X</button>
                  </td>
                </tr>
              ))}

              {/* totals rows */}
              <tr>
                <td colSpan={5} style={{ padding: 8, fontWeight: "bold" }}>GFRC TOTAL</td>
                <td colSpan={3} style={{ padding: 8, textAlign: "right" }}>₹ {subtotal.toLocaleString()}</td>
              </tr>

              <tr>
                <td colSpan={5} style={{ padding: 8 }}>ADD : TRANSPORTATION AND PACKING AS ACTUAL</td>
                <td colSpan={3} style={{ padding: 8, textAlign: "right" }}>₹ {Number(form.transport || 0).toLocaleString()}</td>
              </tr>

              <tr>
                <td colSpan={5} style={{ padding: 8 }}>ADD : GST {form.gstPercent}% EXTRA</td>
                <td colSpan={3} style={{ padding: 8, textAlign: "right" }}>₹ {gst.toLocaleString()}</td>
              </tr>

              <tr>
                <td colSpan={5} style={{ padding: 8 }}>ROUND OFF</td>
                <td colSpan={3} style={{ padding: 8, textAlign: "right" }}>
                  {form.round ? (Math.round(totalBeforeRound) - totalBeforeRound).toFixed(2) : "0.00"}
                </td>
              </tr>

              <tr style={{ background: "#eee" }}>
                <td colSpan={5} style={{ padding: 8, fontWeight: "bold" }}>TOTAL AMOUNT OF GRC WITH TAX</td>
                <td colSpan={3} style={{ padding: 8, textAlign: "right", fontWeight: "bold" }}>₹ {finalTotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* transport, gst, round controls */}
        <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <label>Transport</label>
            <input type="number" name="transport" value={form.transport} onChange={handleChange} style={input} />
          </div>

          <div>
            <label>GST %</label>
            <input type="number" name="gstPercent" value={form.gstPercent} onChange={handleChange} style={{ width: 80, padding: 8 }} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" name="round" checked={form.round} onChange={handleChange} />
            <label>Round</label>
          </div>
        </div>

        <div style={{ marginTop: 14, textAlign: "right" }}>
          <div>Subtotal : ₹ {subtotal.toLocaleString()}</div>
          <div>Transport : ₹ {Number(form.transport || 0).toLocaleString()}</div>
          <div>GST : ₹ {gst.toLocaleString()}</div>

<div
  style={{
    fontSize: 20,
    fontWeight: 800,
    color: "#0E2A52",
    background: "#FFF8E1",
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
    border: "1px solid #d4a017",
  }}
>
  Total : ₹ {finalTotal.toLocaleString()}
</div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
<button
onClick={handleGenerateQuotation}
style={{ ...btn }}
>
Preview Quotation
</button>

<button
onClick={saveQuotation}
style={{ ...btn, background:"#0a7d00"}}
>
Save Quotation
</button>

<button
onClick={generatePDF}
style={{ ...btn }}
>
Download PDF
</button>

          <button onClick={clearItems} style={{ ...btn, background: "crimson" }}>Clear Items</button>
        </div>
      </div>

      {/* ========== Preview & PDF area ========== */}
      {showPreview && (
        <>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 style={{ textAlign: "center", marginTop: 0,color:"#F4B000" }}>Quotation Preview</h1>
            <div>
              <button onClick={() => { setShowPreview(false); }} style={{ ...btn, background: "#666", marginRight: 8 }}>Close Preview</button>
              <button onClick={generatePDF} style={{ ...btn, background: "#0a7d00" }}>Download PDF</button>
            </div>
          </div>

          {/* PDF WRAPPER: EXACTLY TWO A4 PAGES */}
          <div
  id="pdf-wrapper"
  style={{
    width: "210mm",
    minHeight: "594mm",   // ⭐ EXACT FIX: 2 × 297mm
    background: "white",
    boxSizing: "border-box",
  }}
>

            {/* ---------- PAGE 1 (Header + Details + Items + Totals + Amount in words) ---------- */}
            <div
              id="page-1"
              style={{
                width: "210mm",
                height: "297mm",
                boxSizing: "border-box",
                padding: "8mm",
                border: "4px solid #000",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* HEADER (logo + centered letterhead) */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 140, height: 140, flex: "0 0 140px" }}>
                  <img src={LOGO} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
                </div>

                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 30, fontWeight: 700, color: "#F4B000", letterSpacing: 1, fontFamily: "Times New Roman, serif" }}>
                    LOOK GRC ART DECO
                  </div>

                  <div style={{ fontSize: 11.5, marginTop: 4, color: "#0b66a3", fontFamily: "Times New Roman, serif" }}>
                    OFFICE : VICTOR HOUSE, 2ND FLOOR, PADWAL NAGAR, NEAR PADWAL SCHOOL, THANE (W) - 400 604
                  </div>

                  <div style={{ fontSize: 11.5, marginTop: 4, color: "#0b66a3", textDecoration: "underline", fontFamily: "Times New Roman, serif" }}>
                    E-Mail : lookgrcartdeco@gmail.com
                  </div>

                  <div style={{ fontSize: 12, marginTop: 4, color: "#333", fontWeight: 700, fontFamily: "Times New Roman, serif" }}>
                    GSTIN – 27ASPPB8640L1Z9
                  </div>

                  <div style={{ fontSize: 20, marginTop: 8, textDecoration: "underline", fontWeight: 700, fontFamily: "Times New Roman, serif" }}>
                    QUOTATION (R1)
                  </div>
                </div>
              </div>

              {/* small separator line */}
              <div style={{ width: "100%", borderBottom: "1px solid #000", marginTop: 6, marginBottom: 8 }} />

              {/* DETAILS */}
              <div style={{ fontSize: 13, marginTop: 6, fontFamily: "Times New Roman, serif", fontWeight: 700 }}>
                <p style={{ margin: "4px 0" }}><b>DATE :</b> {form.date}</p>
                <p style={{ margin: "4px 0" }}><b>Ref :</b> {form.refNo}</p>
                <p style={{ margin: "4px 0" }}><b>Client :</b> {form.client}</p>
                <p style={{ margin: "4px 0" }}><b>Project :</b> {form.project}</p>
                <p style={{ margin: "4px 0" }}><b>Sub :-</b> {form.note}</p>
                <p style={{ margin: "4px 0" }}><b>Kind Attn :</b> {form.kindAttn}</p>

                <p style={{ color: "red", fontSize: 12, marginTop: 8, fontFamily: "Times New Roman, serif", textDecoration: "underline", display: "inline-block", textUnderlineOffset: 3 }}>
                  Note : We are sharing the quotation rates as per your sending site details. If needed MS framework for GFRC will be provided by Client.
                </p>
              </div>

              {/* TABLE (allowing it to grow, but limited so page fits) */}
              <div style={{ marginTop: 8, flex: 1, overflow: "hidden", fontFamily: "Times New Roman, serif" }}>
                <div style={{ maxHeight: "calc(100% - 120px)", overflow: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }} border="1">
                    <thead>
                      <tr style={{ background: "#f4f4f4" }}>
                        <th style={{ padding: 6 }}>SL No</th>
                        <th style={{ padding: 6 }}>ITEM CODE</th>
                        <th style={{ padding: 6 }}>Name of Items</th>
                        <th style={{ padding: 6 }}>Qty</th>
                        <th style={{ padding: 6 }}>Unit</th>
                        <th style={{ padding: 6 }}>Rate</th>
                        <th style={{ padding: 6 }}>Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((i, index) => (
                        <tr key={i.id}>
                          <td style={{ padding: 6, textAlign: "center" }}>{index + 1}</td>
                          <td style={{ padding: 6 }}>{i.code}</td>
                          <td style={{ padding: 6 }}>{i.name}</td>
                          <td style={{ padding: 6, textAlign: "center" }}>{i.qty}</td>
                          <td style={{ padding: 6, textAlign: "center" }}>{i.unit}</td>
                          <td style={{ padding: 6, textAlign: "right" }}>{Number(i.rate).toLocaleString()}</td>
                          <td style={{ padding: 6, textAlign: "right" }}>{Number(i.amount).toLocaleString()}</td>
                        </tr>
                      ))}

                      <tr>
                        <td colSpan="5" style={{ padding: 6 }}>GFRC TOTAL</td>
                        <td colSpan="2" style={{ padding: 6, textAlign: "right" }}>₹ {subtotal.toLocaleString()}</td>
                      </tr>

                      <tr>
                        <td colSpan="5" style={{ padding: 6 }}>ADD : TRANSPORTATION AND PACKING AS ACTUAL</td>
                        <td colSpan="2" style={{ padding: 6, textAlign: "right" }}>₹ {Number(form.transport).toLocaleString()}</td>
                      </tr>

                      <tr>
                        <td colSpan="5" style={{ padding: 6 }}>ADD : GST {form.gstPercent}% EXTRA</td>
                        <td colSpan="2" style={{ padding: 6, textAlign: "right" }}>₹ {gst.toLocaleString()}</td>
                      </tr>

                      <tr>
                        <td colSpan="5" style={{ padding: 6 }}>ROUND OFF</td>
                        <td colSpan="2" style={{ padding: 6, textAlign: "right" }}>{form.round ? (Math.round(totalBeforeRound) - totalBeforeRound).toFixed(2) : "0.00"}</td>
                      </tr>

                      <tr style={{ background: "#eee" }}>
                        <td colSpan="5" style={{ padding: 6, fontWeight: "bold" }}>TOTAL AMOUNT OF GRC WITH TAX</td>
                        <td colSpan="2" style={{ padding: 6, textAlign: "right", fontWeight: "bold" }}>₹ {finalTotal.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AMOUNT IN WORDS + footer signature line area inside page1 (keeps page1 complete) */}
              <div style={{ marginTop: 8 }}>
                <p style={{ marginTop: 8, fontStyle: "italic", textDecoration: "underline", fontFamily: "Times New Roman, serif", fontWeight: 700 }}>
                  AMOUNT IN WORDS : {numberToWordsIndian(finalTotal)} ONLY
                </p>
              </div>
            </div>

            {/* ---------- PAGE 2 (Terms & Conditions + Payment Terms + Signatures) ---------- */}
            <div
              id="page-2"
              style={{
                width: "210mm",
                height: "297mm",
                boxSizing: "border-box",
                padding: "8mm",
                border: "4px solid black",
                overflow: "hidden",
                fontFamily: "Times New Roman, serif",
              }}
            >
              {/* Only border + title (no header) */}
              <h3 style={{ color: "red", textDecoration: "underline", marginBottom: 8, fontWeight: 700 }}>
                Other Terms & Conditions:
              </h3>

              <div style={{ overflowY: "auto", maxHeight: "calc(100% - 160px)" }}>
                <ol style={{ lineHeight: 1.6, fontSize: 15 }}>
                  <li>Re-measurable contract on Completion.</li>

                  <li style={{ fontWeight: "bold", textDecoration: "underline" }}>
                    Crane for Offloading & installation, water, electricity & rest room for the installation team. Shifting of materials on site will be provided by the main contractor at free of cost.
                  </li>

                  <li>Supply and erection of scaffolding, Secondary Frame work to support GFRC panels, structural Calculations of GFRC Panels, Storage & any painting is not in our scope.</li>

                  <li>Balance material left over after completion of works will be sole property of M/S LOOK GRC ART DECO & the Transportation of materials will be to your account on actual or we can send materials through your transporter.</li>

                  <li>Painting / Civil Work is not in our scope of work. Fabrication is in client scope.</li>

                  <li>All fixtures will be S.S with face fixing for GFRC Works.</li>

                  <li>All GFRC Elements will be made in appropriate section / modules.</li>

                  <li>One side will be Mould Finish & Back side trowel finish.</li>

                  <li>All joints will be overlap/clear open tape, no filling or sealants will be used.</li>

                  <li>Material testing if required will be at Your cost from any testing facility of repute.</li>

                  <li>Revision of rates will be required for any changes in sizes (Dimensions) & or Quantities.</li>

                  <li>Rates Quoted for supply of GFRC components above are Ex Factory Rates.</li>

                  <li style={{ fontWeight: "bold", textDecoration: "underline" }}>
                    Transportation of materials will be to your account on actual or we can send materials through your transporter.
                  </li>

                  <li style={{ fontWeight: "bold", textDecoration: "underline" }}>
                    For projects outside Mumbai local accommodation (with water & electricity) & transportation to be provided.
                  </li>
                </ol>

                {/* PAYMENT TERMS */}
                <h3 style={{ marginTop: 14, color: "red", textDecoration: "underline", fontWeight: 700 }}>
                  Terms & Conditions of Payment:
                </h3>

                <ol style={{ lineHeight: 1.7, fontSize: 15 }}>
                  <li style={{ fontWeight: "bold", textDecoration: "underline" }}>40% of estimated cost as advance with confirmed work order or LOI.</li>
                  <li style={{ fontWeight: "bold", textDecoration: "underline" }}>40% on inspection at factory & before dispatch.</li>
                  <li style={{ fontWeight: "bold", textDecoration: "underline" }}>15% of estimated cost as per work progress.</li>
                  <li style={{ fontWeight: "bold", textDecoration: "underline" }}>5% on completion & handover.</li>
                  <li>We will not provide any bank guarantee towards advance to be issued to us.</li>
                  <li style={{ fontWeight: "bold", textDecoration: "underline" }}>Local Taxes/GST 18% /Octroi/Road permit & Duties will be charged Extra on actual applicable at the time of dispatch.</li>
                  <li>All the commercial to be done with “LOOK GRC ART DECO”.</li>
                  <li>Approximate Programme Requirement: To be discussed & agreed upon at the time of order finalization, generally in line with your requirement.</li>
                  <li>Validity 30 days.</li>
                  <li>We look forward a positive response & relationship with you. In case of any queries or any clarifications, please call the undersigned.</li>
                </ol>
              </div>

              {/* SIGNATURES FOOTER (keeps inside page-2) */}
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 8 }}>
                <div>
                  <b style={{ fontFamily: "Times New Roman", fontWeight: 700, textDecoration: "underline", fontSize: 14 }}>Thanking you</b>
                  <br />
                  <span style={{ fontFamily: "Times New Roman", fontWeight: 700, fontSize: 14 }}>M/S LOOK GRC ART DECO.</span>
                  <br /><br />
                  <span style={{ color: "red", fontWeight: "bold", fontSize: 14 }}>AJAY M. BAROT.</span><br />
                  <span style={{ fontWeight: "bold", fontSize: 14 }}>OWNER</span>
                </div>

                <div style={{ textAlign: "right", marginTop: 10 }}>
                  <span style={{ fontWeight: "bold", fontSize: 14 }}>RECEIVER'S SIGN & STAMP.</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
