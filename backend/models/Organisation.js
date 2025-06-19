//models/Organisation.js
import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    baseCountry: {
      type: String,
      enum: [
        "AT", // Austria
        "BE", // Belgium
        "BG", // Bulgaria
        "HR", // Croatia
        "CY", // Cyprus
        "CZ", // Czechia
        "DK", // Denmark
        "EE", // Estonia
        "FI", // Finland
        "FR", // France
        "DE", // Germany
        "GR", // Greece
        "HU", // Hungary
        "IE", // Ireland
        "IT", // Italy
        "LV", // Latvia
        "LT", // Lithuania
        "LU", // Luxembourg
        "MT", // Malta
        "NL", // Netherlands
        "PL", // Poland
        "PT", // Portugal
        "RO", // Romania
        "SK", // Slovakia
        "SI", // Slovenia
        "ES", // Spain
        "SE", // Sweden,
      ],
    },
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
    socialMedia: {
      facebook: { type: String },
      instagram: { type: String },
      website: { type: String },
    },
    coordinators: [
      {
        name: { type: String, required: false },
        photo: { type: String },
        role: { type: String },
        email: { type: String },
      },
    ],
    hostedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    // ✅ Aici adaugi câmpul lipsă:
    partnerIn: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Organisation", organisationSchema);
