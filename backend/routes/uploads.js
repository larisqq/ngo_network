// File: backend/routes/uploads.js
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinaryConfig.js";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "temp/" });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ong_network",
    });

    fs.unlinkSync(req.file.path); // șterge temporar
    res.status(200).json({ url: result.secure_url });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Image upload failed" });
  }
});

export default router;
