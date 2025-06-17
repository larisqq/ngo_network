import express from "express";
import Organisation from "../models/Organisation.js";
import PendingOrganisation from "../models/PendingOrganisation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/mailer.js";

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

// VERIFY - mută organizația în colecția reală
router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const pendingOrg = await PendingOrganisation.findOne({
      verificationToken: token,
    });
    if (!pendingOrg) return res.status(400).json({ error: "Invalid token" });

    const finalOrg = new Organisation({
      name: pendingOrg.name,
      logo: pendingOrg.logo,
      password: pendingOrg.password,
      contact: { email: pendingOrg.contact.email },
      isVerified: true,
    });

    await finalOrg.save();
    await PendingOrganisation.deleteOne({ _id: pendingOrg._id });

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ LOGIN
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

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
