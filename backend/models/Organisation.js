import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    description: { type: String },
    domains: [{ type: String }],
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    contact: {
      email: { type: String, required: true, unique: true },
      phone: { type: String },
      whatsapp: { type: String },
    },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      website: { type: String },
    },
    coordinators: [
      {
        name: { type: String, required: true },
        photo: { type: String },
        role: { type: String },
        email: { type: String },
      },
    ],
    erasmusProjects: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        domains: [{ type: String }],
        startDate: { type: Date },
        endDate: { type: Date },
      },
    ],
    // ✅ Aici adaugi câmpul lipsă:
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Organisation", organisationSchema);
