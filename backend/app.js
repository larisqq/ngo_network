import path from "path";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import organisationRoutes from "./routes/organisations.js";
import projectRoutes from "./routes/projects.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Conectare DB
connectDB();

// Rute
app.use("/api/organisations", organisationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);

export default app;
