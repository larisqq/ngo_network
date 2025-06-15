import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    country: {
      type: String,
      enum: ["RO", "MD", "UA", "BG", "HU", "RS"],
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
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },
    partners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Organisation" }],
    location: String,
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
