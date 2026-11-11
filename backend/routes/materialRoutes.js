import express from "express";
import Material from "../models/Material.js";

const router = express.Router();


// GET all materials
router.get("/", async (req, res) => {
  try {

    const materials = await Material.find();

    res.json(materials);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ADD material (admin)
router.post("/add", async (req, res) => {

  try {

    const { name, category, description, price } = req.body;

    const newMaterial = new Material({
      name,
      category,
      description,
      price
    });

    await newMaterial.save();

    res.json({ message: "Material added successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

export default router;