// models/Project.js
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: {
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
        "SE", // Sweden
      ],
    },
    description: String,
    domain: {
      type: String,
      enum: [
        "education",
        "well-being",
        "youth",
        "sports",
        "culture",
        "digital",
        "environment",
      ],
    },
    deadline: Date,
    infoPackUrl: String,
    coverImageUrl: String,
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    partners: [
      {
        instagram: { type: String, required: true },
        country: { type: String, required: true },
        organisationRef: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Organisation",
          default: null, // va fi completat doar dacă există ONG-ul
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
