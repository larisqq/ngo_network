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

// Get project by ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("host", "name _id")
      .populate("partners", "name _id");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    console.error("Error in GET /projects/:id", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
