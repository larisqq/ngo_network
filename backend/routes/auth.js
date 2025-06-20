import express from "express";
import Organisation from "../models/Organisation.js";
import PendingOrganisation from "../models/PendingOrganisation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/mailer.js";
import Project from "../models/Project.js";

const router = express.Router();
// routhes/auth.js
// ✅ SIGNUP - doar dacă emailul nu există în ambele colecții
router.post("/signup", async (req, res) => {
  const { name, email, password, logo } = req.body;

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
      verificationToken: token,
    });

    await pendingOrg.save();
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: "Verification email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Veche (greșită):
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
      logo: pendingOrg.logo,
      email: pendingOrg.contact.email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ FINALIZE REGISTRATION
router.post("/finalize", async (req, res) => {
  const token = req.query.token;
  const { description, domains, socialMedia, phone } = req.body;

  try {
    const pendingOrg = await PendingOrganisation.findOne({
      verificationToken: token,
    });

    if (!pendingOrg) return res.status(400).json({ error: "Invalid token" });

    // 🔍 Caută proiectele în care partenerul apare cu acel Instagram
    let matchedProjects = [];
    if (socialMedia?.instagram) {
      matchedProjects = await Project.find({
        "partners.instagram": socialMedia.instagram,
      });
    }

    const finalOrg = new Organisation({
      name: pendingOrg.name,
      logo: pendingOrg.logo,
      password: pendingOrg.password,
      contact: {
        email: pendingOrg.contact.email,
        phone: phone || null,
      },
      description,
      domains,
      socialMedia,
      isVerified: true,
      // 🧠 Populate automat pe baza Instagramului
      partnerIn: matchedProjects.map((p) => p._id),
    });

    await finalOrg.save();

    await PendingOrganisation.deleteOne({ _id: pendingOrg._id });

    res.status(200).json({ message: "Organisation registered and verified!" });
  } catch (err) {
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
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 zile
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
