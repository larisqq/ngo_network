import path from "path";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import organisationRoutes from "./routes/organisations.js";
import projectRoutes from "./routes/projects.js";
import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import uploadRoutes from "./routes/uploads.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Conectare DB
connectDB();

// Rute
app.use("/api/organisations", organisationRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);

export default app;
