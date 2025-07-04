// File: backend/routes/auth.js
import express from "express";
import Organisation from "../models/Organisation.js";
import PendingOrganisation from "../models/PendingOrganisation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/mailer.js";
import Project from "../models/Project.js";
import multer from "multer";
import fs from "fs";

const upload = multer({ dest: "temp/" });

const router = express.Router();

// ✅ SIGNUP - doar dacă emailul nu există în ambele colecții
router.post("/signup", async (req, res) => {
  const { name, email, password, logo, baseCountry, instagram } = req.body;

  try {
    const existingOrg = await Organisation.findOne({ "contact.email": email });
    const existingPending = await PendingOrganisation.findOne({
      "contact.email": email,
    });

    if (existingOrg || existingPending) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const token = crypto.randomBytes(32).toString("hex");

    const pendingOrg = new PendingOrganisation({
      name,
      logo,
      password: hashedPassword,
      contact: { email },
      socialMedia: {
        instagram: instagram, // ✅ Instagram handle salvat direct
      },
      verificationToken: token,
      baseCountry,
    });

    await pendingOrg.save();
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get("/verify/:token", async (req, res) => {

router.get("/verify", async (req, res) => {
  const token = req.query.token;

  try {
    const pendingOrg = await PendingOrganisation.findOne({
      verificationToken: token,
    });

    if (!pendingOrg) {
      return res.status(400).json({ error: "Invalid token" });
    }

    // NU mutăm încă organizația în baza de date finală!
    res.status(200).json({
      name: pendingOrg.name,
      email: pendingOrg.contact.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ FINALIZE REGISTRATION - updated version (instagram-only)
router.post("/finalize", upload.single("logo"), async (req, res) => {
  const token = req.query.token;
  const { description, domains, socialMedia, phone } = req.body;

  try {
    const pendingOrg = await PendingOrganisation.findOne({
      verificationToken: token,
    });

    if (!pendingOrg) return res.status(400).json({ error: "Invalid token" });

    let logoUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "ong_network/logos",
      });
      logoUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    // 🧠 Creează ONG-ul final
    const finalOrg = new Organisation({
      name: pendingOrg.name,
      logo: logoUrl || pendingOrg.logo,
      password: pendingOrg.password,
      baseCountry: pendingOrg.baseCountry,
      contact: {
        email: pendingOrg.contact.email,
        phone: phone || null,
      },
      description,
      domains,
      socialMedia: {
        instagram: pendingOrg.socialMedia.instagram, // preia Instagram din pending
        ...socialMedia, // adaugă restul social media
      },
      isVerified: true,
      partnerIn: [], // se completează imediat mai jos
    });

    // 🔍 Caută proiecte cu partener care are același Instagram
    const affectedProjects = await Project.find({
      "partners.instagram": pendingOrg.socialMedia.instagram,
    });

    console.log(`📌 Found ${affectedProjects.length} matching projects`);

    const updatedProjectIds = [];

    for (const project of affectedProjects) {
      let updated = false;

      project.partners.forEach((partner) => {
        if (
          partner.instagram === socialMedia.instagram &&
          !partner.organisationRef
        ) {
          partner.organisationRef = finalOrg._id;
          updated = true;
        }
      });

      if (updated) {
        await project.save();
        updatedProjectIds.push(project._id.toString());
        console.log(
          `✅ Updated project ${project.name} with new organisationRef`
        );
      }
    }

    // Adaugă proiectele în care e partener
    finalOrg.partnerIn = updatedProjectIds;
    await finalOrg.save();

    // 🧼 Curăță pending organisation
    await PendingOrganisation.deleteOne({ _id: pendingOrg._id });

    res.status(200).json({ message: "Organisation registered and verified!" });
  } catch (err) {
    console.error("❌ Finalize error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOGIN - cu cookie
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const org = await Organisation.findOne({ "contact.email": email });
    if (!org)
      return res.status(400).json({ error: "Invalid email or password" });

    if (!org.isVerified)
      return res.status(403).json({ error: "Please verify your email first" });

    const valid = await bcrypt.compare(password, org.password);
    if (!valid)
      return res.status(400).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: org._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 zi
      })
      .json({
        message: "Login successful",
        logo: org.logo,
        name: org.name,
        id: org._id,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOGOUT - șterge cookie-ul
router.post("/logout", (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });
  res.json({ message: "Logged out successfully" });
});

export default router;
