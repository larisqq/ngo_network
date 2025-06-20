import express from "express";
import multer from "multer";
import fs from "fs";
import cloudinary from "../config/cloudinaryConfig.js";
import Project from "../models/Project.js";

const router = express.Router();

// Doar coverImage e acceptat ca fișier
const upload = multer({ dest: "temp/" });

// GET toate proiectele
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("host", "name logo")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error("Eroare la GET /projects:", err.message);
    res.status(500).json({ error: "Eroare la încărcarea proiectelor." });
  }
});

// GET proiect după ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("host", "name _id logo")
      .populate("partners.organisationRef", "name _id");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error("Error in GET /projects/:id", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/projects – fără upload pentru InfoPack
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const {
      name,
      description,
      startDate,
      endDate,
      country,
      domain,
      location,
      deadline,
      host,
      infoPackUrl,
      targetAudience,
      applyUrl,
      objectives,
      partners,
    } = req.body;

    let coverImageUrl = null;

    // ✅ Upload cover image
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "ong_network/covers",
      });
      coverImageUrl = imageUpload.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newProject = new Project({
      name,
      description,
      startDate,
      endDate,
      country,
      domain,
      location,
      deadline,
      host,
      infoPackUrl, // direct string din formular
      coverImageUrl,
      targetAudience,
      applyUrl,
      objectives: JSON.parse(objectives || "[]"),
      partners: JSON.parse(partners || "[]"),
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    console.error("❌ Error uploading project:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;
