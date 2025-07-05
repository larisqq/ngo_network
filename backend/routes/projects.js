import express from "express";
import Project from "../models/Project.js";
import Organisation from "../models/Organisation.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from "bcrypt";

const router = express.Router();

// 🔧 Helper pentru normalizarea partenerilor
// Înlocuiește normalizarea cu această versiune:
const normalizePartnersWithRefs = async (partners = []) => {
  const normalized = [];

  for (const p of partners) {
    // Caută ONG-ul existent după Instagram (dacă are)
    let organisation = null;
    if (p.instagram) {
      organisation = await Organisation.findOne({
        "socialMedia.instagram": p.instagram,
      });
    }

    if (organisation) {
      normalized.push({
        organisationRef: organisation._id,
        instagram: p.instagram,
        baseCountry: p.baseCountry,
      });
    } else {
      normalized.push({
        name: p.name,
        instagram: p.instagram,
        baseCountry: p.baseCountry,
      });
    }
  }

  return normalized;
};

// ✅ GET /api/projects - toate proiectele
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

// ✅ GET /api/projects/:id - detalii pentru un proiect
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("host", "name _id logo")
      .populate(
        "partners.organisationRef",
        "name _id logo socialMedia baseCountry"
      );

    if (!project) {
      return res.status(404).json({ message: "Proiectul nu a fost găsit." });
    }

    res.json(project);
  } catch (err) {
    console.error("Eroare la GET /projects/:id:", err.message);
    res.status(500).json({ error: "Eroare de server." });
  }
});

// ✅ POST /api/projects - crează proiect nou
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      period,
      deadline,
      country,
      domain,
      location,
      host,
      infoPackUrl,
      coverImageUrl,
      targetAudience,
      applyUrl,
      objectives,
      partners,
    } = req.body;

    const normalizedPartners = await normalizePartnersWithRefs(partners);

    const newProject = new Project({
      name,
      description,
      period: {
        start: period?.start,
        end: period?.end,
      },
      deadline,
      country,
      domain,
      location,
      host,
      infoPackUrl,
      coverImageUrl,
      targetAudience,
      applyUrl,
      objectives,
      partners: normalizedPartners,
    });

    await newProject.save();

    // 🟢 Adaugă la hostedProjects ONG-ului gazdă
    if (host) {
      await Organisation.findByIdAndUpdate(host, {
        $addToSet: { hostedProjects: newProject._id },
      });
    }

    // 🟢 Adaugă la partnerIn pentru ONG-urile partenere înregistrate
    for (const p of normalizedPartners) {
      if (p.organisationRef) {
        await Organisation.findByIdAndUpdate(p.organisationRef, {
          $addToSet: { partnerIn: newProject._id },
        });
      }
    }

    res.status(201).json(newProject);
  } catch (err) {
    console.error("Error creating project:", err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// ✅ PUT /api/projects/:id - actualizează un proiect
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Verificare permisiuni
    if (project.host.toString() !== req.user.id) {
      return res.status(403).json({
        error: "Access denied. You are not the host of this project.",
      });
    }

    const {
      name,
      description,
      period,
      deadline,
      country,
      domain,
      location,
      infoPackUrl,
      coverImageUrl,
      targetAudience,
      applyUrl,
      objectives,
      partners,
    } = req.body;

    const normalizedPartners = await normalizePartnersWithRefs(partners);

    // 🔄 Update câmpuri
    project.name = name ?? project.name;
    project.description = description ?? project.description;
    project.period = {
      start: period?.start ?? project.period.start,
      end: period?.end ?? project.period.end,
    };
    project.deadline = deadline ?? project.deadline;
    project.country = country ?? project.country;
    project.domain = domain ?? project.domain;
    project.location = location ?? project.location;
    project.infoPackUrl = infoPackUrl ?? project.infoPackUrl;
    project.coverImageUrl = coverImageUrl ?? project.coverImageUrl;
    project.targetAudience = targetAudience ?? project.targetAudience;
    project.applyUrl = applyUrl ?? project.applyUrl;
    project.objectives = objectives ?? project.objectives;
    project.partners = normalizedPartners;

    await project.save();

    // (opțional) poți face cleanup/actualizări pentru organizațiile partenere

    res.json({ message: "Project updated successfully", project });
  } catch (err) {
    console.error("Error updating project:", err.message);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

// ✅ DELETE /api/projects/:id - șterge proiectul (doar dacă parola e corectă)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;
    const { password } = req.body; // parola trimisă din frontend

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (project.host.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Access denied. You are not the host." });
    }

    const org = await Organisation.findById(req.user.id);
    if (!org) {
      return res.status(404).json({ error: "Organisation not found" });
    }

    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch) {
      return res.status(403).json({ error: "Incorrect password" });
    }

    await Project.findByIdAndDelete(projectId);

    // 🔄 Șterge proiectul din lista ONG-ului gazdă
    await Organisation.findByIdAndUpdate(org._id, {
      $pull: { hostedProjects: project._id },
    });

    // 🔄 Șterge proiectul din listele partenerilor
    for (const partner of project.partners) {
      if (partner.organisationRef) {
        await Organisation.findByIdAndUpdate(partner.organisationRef, {
          $pull: { partnerIn: project._id },
        });
      }
    }

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
