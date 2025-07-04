import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    baseCountry: {
      type: String,
      required: true,
    },
    instagram: String, // doar pt ONG neînregistrat sau înregistrat
    name: String, // doar pt ONG neînregistrat
    organisationRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation", // doar pt ONG înregistrat
    },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: String,
    period: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    deadline: String,
    country: String,
    domain: [String],
    location: String,
    infoPackUrl: String,
    coverImageUrl: String,
    targetAudience: String,
    applyUrl: String,
    objectives: [String],

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
    },

    partners: [partnerSchema],
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
