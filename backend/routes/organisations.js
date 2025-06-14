import express from "express";
import Organisation from "../models/Organisation.js";

const router = express.Router();

// Obține toate organizațiile
router.get("/", async (req, res) => {
  try {
    const organisations = await Organisation.find();
    res.json(organisations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creează organizație nouă
router.post("/", async (req, res) => {
  const organisation = new Organisation({
    name: req.body.name,
    logo: req.body.logo,
    description: req.body.description,
  });

  try {
    const newOrganisation = await organisation.save();
    res.status(201).json(newOrganisation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
