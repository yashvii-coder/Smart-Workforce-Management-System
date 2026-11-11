import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Materials() {

  const nav = useNavigate();

  const [category, setCategory] = useState("COLUMNS");
  const [selectedItems, setSelectedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* DEFAULT PRODUCTS (YOUR ORIGINAL LIST) */

  const defaultProducts = [

    { name: "GRC Decorative Columns", cat: "COLUMNS" },
    { name: "GRC Columns", cat: "COLUMNS" },
    { name: "GRC Ornate Column Capitals", cat: "COLUMNS" },
    { name: "GRC Capitals", cat: "COLUMNS" },
    { name: "Classic GRC Elements", cat: "COLUMNS" },

    { name: "GRC Facade Cladding", cat: "FACADE" },
    { name: "GRC Louvers", cat: "FACADE" },
    { name: "GRC Jaali", cat: "FACADE" },
    { name: "GRC Window", cat: "FACADE" },
    { name: "Fiber Reinforced Polymer (FRP) Panels", cat: "FACADE" },

    { name: "Custom Architectural Molding", cat: "DECORATIVE" },
    { name: "Precast GRC Skirting", cat: "DECORATIVE" },
    { name: "GRC Cornice", cat: "DECORATIVE" },
    { name: "GRC Base", cat: "DECORATIVE" },
    { name: "GRC Planters", cat: "DECORATIVE" },
    { name: "GFRC Brackets", cat: "DECORATIVE" }

  ];

  /* FETCH MATERIALS FROM BACKEND */

  useEffect(() => {

    const fetchMaterials = async () => {

      try {

        const res = await axios.get("http://localhost:5000/api/materials");

        if (res.data && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(defaultProducts);
        }

      } catch (err) {

        console.log("Backend not available, using default materials");
        setProducts(defaultProducts);

      } finally {

        setLoading(false);

      }

    };

    fetchMaterials();

  }, []);

  /* FILTER PRODUCTS */

  const filteredProducts =
    category === "ALL"
      ? products
      : products.filter((p) => p.cat === category);

  /* SELECT PRODUCT */

  const toggleSelect = (product) => {

    const exists = selectedItems.find((p) => p.name === product.name);

    if (exists) {
      setSelectedItems(selectedItems.filter((p) => p.name !== product.name));
    } else {
      setSelectedItems([...selectedItems, product]);
    }
  };

  /* GENERATE QUOTATION */

  const generateQuotation = () => {

    if (selectedItems.length === 0) {
      alert("Please select at least one product");
      return;
    }

    nav("/quotation", {
      state: { products: selectedItems }
    });

  };

  return (

    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        background: "linear-gradient(135deg, #1f4fb2 0%, #0e2a52 100%)"
      }}
    >

      <h1 style={{ fontSize: "36px", fontWeight: "800", color: "#fff" }}>
        Materials & Products
      </h1>

      <p style={{ marginTop: "8px", color: "#d4a017", fontSize: "18px" }}>
        Look GRC Art Deco — Product Catalogue
      </p>

      {/* CATEGORY SELECT */}

      <div style={{ marginTop: "30px" }}>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "600",
            border: "2px solid #d4a017"
          }}
        >

          <option value="COLUMNS">Columns</option>
          <option value="FACADE">Facade</option>
          <option value="DECORATIVE">Decorative</option>
          <option value="ALL">View All</option>

        </select>

      </div>

      {/* GENERATE BUTTON */}

      <button
        onClick={generateQuotation}
        style={{
          marginTop: "20px",
          padding: "10px 18px",
          borderRadius: "10px",
          border: "none",
          background: "#d4a017",
          color: "#000",
          fontWeight: "700",
          cursor: "pointer"
        }}
      >
        Generate Quotation ({selectedItems.length})
      </button>

      {/* LOADING */}

      {loading && (
        <p style={{ marginTop: "30px", color: "#fff" }}>
          Loading materials...
        </p>
      )}

      {/* PRODUCTS */}

      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: "24px"
        }}
      >

        {filteredProducts.map((item, i) => (

          <div
            key={i}
            style={{
              background: "#f5f7fb",
              borderRadius: "18px",
              padding: "24px",
              borderLeft: "6px solid #d4a017",
              boxShadow: "0 10px 25px rgba(0,0,0,0.12)"
            }}
          >

            <input
              type="checkbox"
              checked={selectedItems.some((p) => p.name === item.name)}
              onChange={() => toggleSelect(item)}
              style={{ marginBottom: "10px" }}
            />

            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "#1f2937"
              }}
            >
              {item.name}
            </h3>

            <p style={{ fontSize: "14px", color: "#374151" }}>
              Premium architectural product crafted for luxury and durability.
            </p>

          </div>

        ))}

      </div>

    </div>

  );
}