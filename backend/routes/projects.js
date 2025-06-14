import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// Create project
router.post("/", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  const projects = await Project.find().populate("host", "name");
  res.json(projects);
});

// Get by ID
router.get("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id).populate("host");
  if (!project) return res.status(404).json({ error: "Not found" });
  res.json(project);
});

export default router;
