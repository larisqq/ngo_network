// routes/organisations.js
import express from "express";
import Organisation from "../models/Organisation.js";
import authMiddleware from "../middleware/authMiddleware.js";

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

// Obține o organizație după ID
router.get("/:id", async (req, res) => {
  try {
    const org = await Organisation.findById(req.params.id)
      .populate("hostedProjects")
      .populate("partnerIn");

    if (!org) {
      return res.status(404).json({ message: "Organisation not found" });
    }

    const response = {
      id: org._id,
      name: org.name,
      logo: org.logo,
      description: org.description,
      domains: org.domains || [],
      hostedProjects: (org.hostedProjects || []).map((p) => ({
        id: p._id,
        name: p.name,
        deadline: p.deadline,
      })),
      partnerIn: (org.partnerIn || []).map((p) => ({
        id: p._id,
        name: p.name,
        deadline: p.deadline,
      })),
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
