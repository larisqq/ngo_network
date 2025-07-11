//models/Organisation.js
import mongoose from "mongoose";

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
        "CY", // Cyprus
        "CZ", // Czech Republic
        "DE", // Germany
        "DK", // Denmark
        "EE", // Estonia
        "FI", // Finland
        "FR", // France
        "GB", // United Kingdom
        "GR", // Greece
        "HR", // Croatia
        "HU", // Hungary
        "IE", // Ireland
        "IS", // Iceland
        "IT", // Italy
        "LI", // Liechtenstein
        "LT", // Lithuania
        "LU", // Luxembourg
        "MK", // North Macedonia
        "MT", // Malta
        "NL", // Netherlands
        "NO", // Norway
        "PL", // Poland
        "PT", // Portugal
        "RO", // Romania
        "RS", // Serbia
        "SE", // Sweden
        "SI", // Slovenia
        "SK", // Slovakia
        "ES", // Spain
        "TR", // Turkey
      ],
      required: true,
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
