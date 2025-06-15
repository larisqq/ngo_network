import express from "express";
import multer from "multer";
import Project from "../models/Project.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = file.originalname.split(".").pop();
    cb(null, `project-${timestamp}.${ext}`);
  },
});
const upload = multer({ storage });

// Create project
router.post("/", upload.single("infoPack"), async (req, res) => {
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
    } = req.body;

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
      infoPackUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("host", "name logo") // dacă vrei să vezi numele și logo-ul organizației gazdă
      .sort({ createdAt: -1 }); // cele mai recente proiecte primele

    res.json(projects);
  } catch (err) {
    console.error("Eroare la GET /projects:", err.message);
    res.status(500).json({ error: "Eroare la încărcarea proiectelor." });
  }
});

export default router;
