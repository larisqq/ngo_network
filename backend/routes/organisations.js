// routes/organisations.js
import express from "express";
import Organisation from "../models/Organisation.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Project from "../models/Project.js";

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

router.get("/me", authMiddleware, async (req, res) => {
  const org = await Organisation.findById(req.user.id);
  res.json(org);
});

router.put("/update", authMiddleware, async (req, res) => {
  const updates = req.body;

  try {
    const updatedOrg = await Organisation.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    );
    res.json(updatedOrg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RUTA GET /api/organisations/:id - cu hostedProjects și partnerIn
router.get("/:id", async (req, res) => {
  try {
    const organisation = await Organisation.findById(req.params.id);
    if (!organisation) {
      return res.status(404).json({ error: "Organisation not found" });
    }

    // Proiectele în care e host
    const hostedProjects = await Project.find({ host: organisation._id })
      .select("_id name deadline country")
      .lean();

    // Proiectele în care e partener
    const partnerIn = await Project.find({
      "partners.organisationRef": organisation._id,
    })
      .select("_id name deadline country")
      .lean();

    res.json({
      id: organisation._id,
      name: organisation.name,
      logo: organisation.logo,
      description: organisation.description,
      domains: organisation.domains || [],
      hostedProjects: hostedProjects.map((p) => ({
        id: p._id,
        name: p.name,
        deadline: p.deadline,
        country: p.country,
      })),
      partnerIn: partnerIn.map((p) => ({
        id: p._id,
        name: p.name,
        deadline: p.deadline,
        country: p.country,
      })),
    });
  } catch (err) {
    console.error("Error fetching organisation profile:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ error: "Unauthorized - Missing user ID" });
  }

  try {
    const org = await Organisation.findById(req.user.id);
    if (!org) return res.status(404).json({ error: "Organisation not found" });
    res.json(org);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
