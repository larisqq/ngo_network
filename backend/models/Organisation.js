//models/Organisation.js
import mongoose from "mongoose";
import Project from "./Project.js"; // Import Project model for reference

const organisationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String },
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
    countryCode: { type: String },
    description: { type: String },
    domains: [{ type: String }],
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },

    contact: {
      email: { type: String, required: true, unique: true },
      phone: { type: String },
      whatsapp: { type: String },
      countryCode: { type: String, default: "+40" },
      rawPhone: { type: String },
    },

    socialMedia: {
      facebook: { type: String },
      instagram: { type: String, unique: true },
      website: { type: String },
    },
    coordinators: [
      {
        name: { type: String },
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
