import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      enum: ["RO", "MD", "UA", "BG", "HU", "RS"],
    },
    description: String,
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation", // referință către o organizație
      required: true,
    },
    partners: [String],
    location: String,
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
