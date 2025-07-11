import express from "express";
import mongoose from "mongoose";
import Organisation from "../models/Organisation.js";
import Project from "../models/Project.js";
import authMiddleware from "../middleware/authMiddleware.js";
import bcrypt from "bcrypt"; // asigură-te că e instalat

const router = express.Router();

/**
 * GET /api/organisations
 * Listă publică cu toate ONG-urile (doar datele esențiale)
 */
router.get("/", async (req, res) => {
  try {
    const organisations = await Organisation.find().select(
      "_id name logo baseCountry domains"
    );
    res.json(organisations);
  } catch (err) {
    console.error("Eroare la încărcarea ONG-urilor:", err);
    res.status(500).json({ error: "Eroare internă." });
  }
});
/**
 * GET /api/organisations/me
 * Returnează datele ONG-ului autentificat (prin cookie + JWT)
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const org = await Organisation.findById(req.user.id);
    if (!org) {
      return res.status(404).json({ error: "Organizația nu a fost găsită." });
    }
    res.json(org);
  } catch (err) {
    console.error("Eroare la /me:", err);
    res.status(500).json({ error: "Eroare de server." });
  }
});

/**
 * GET /api/organisations/:id
 * Returnează profilul complet al unui ONG (inclusiv proiectele găzduite și partenere)
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID invalid pentru organizație." });
  }

  try {
    const organisation = await Organisation.findById(id)
      .populate({
        path: "hostedProjects",
        select: "_id name deadline baseCountry coverImageUrl",
      })
      .populate({
        path: "partnerIn",
        select: "_id name deadline baseCountry coverImageUrl",
      });

    if (!organisation) {
      return res.status(404).json({ error: "Organizația nu a fost găsită." });
    }

    res.json({
      _id: organisation._id,
      name: organisation.name,
      logo: organisation.logo,
      baseCountry: organisation.baseCountry,
      countryCode: organisation.countryCode ?? organisation.baseCountry,
      description: organisation.description,
      domains: organisation.domains || [],
      contact: organisation.contact || {},
      socialMedia: organisation.socialMedia || {},
      hostedProjects: organisation.hostedProjects || [],
      partnerIn: organisation.partnerIn || [],
    });
  } catch (err) {
    console.error("Eroare la încărcarea profilului ONG:", err);
    res.status(500).json({ error: "Eroare de server." });
  }
});

/**
 * GET /api/organisations/:id/partner-projects
 * Returnează toate proiectele în care ONG-ul este partener prin organisationRef
 */
router.get("/:id/partner-projects", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "ID invalid." });
  }

  try {
    const projects = await Project.find({
      "partners.organisationRef": id,
    })
      .populate("host", "name logo")
      .select("_id name deadline coverImageUrl baseCountry");

    res.json(projects);
  } catch (err) {
    console.error("Eroare la obținerea proiectelor partenere:", err);
    res.status(500).json({ error: "Eroare de server." });
  }
});

/**
 * PUT /api/organisations/update
 * Actualizează datele ONG-ului autentificat
 */
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "logo",
      "description",
      "domains",
      "socialMedia",
      "contact",
      "baseCountry",
      "countryCode",
    ];

    const updateData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }

    const updatedOrg = await Organisation.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    );

    if (!updatedOrg) {
      return res.status(404).json({ error: "Organizația nu a fost găsită." });
    }

    res.json(updatedOrg);
  } catch (err) {
    console.error("Eroare la actualizarea organizației:", err);
    res.status(500).json({ error: "Eroare de server." });
  }
});

// DELETE /api/organisations/:id - ștergere cont ONG (cu parolă)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const orgId = req.params.id;
    const { password } = req.body;

    if (req.user.id !== orgId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this profile." });
    }

    const org = await Organisation.findById(orgId);
    if (!org) return res.status(404).json({ error: "Organisation not found" });

    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch) return res.status(403).json({ error: "Incorrect password" });

    // șterge proiectele gazdă (sau marchează-le ca inactive)
    await Project.deleteMany({ host: orgId });

    // Șterge din proiectele partener unde apare
    await Project.updateMany(
      { "partners.organisationRef": orgId },
      { $pull: { partners: { organisationRef: orgId } } }
    );

    // Șterge ONG-ul
    await Organisation.findByIdAndDelete(orgId);

    res.json({ message: "Organisation deleted successfully" });
  } catch (err) {
    console.error("Error deleting profile:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
export default router;
