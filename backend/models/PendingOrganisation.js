import mongoose from "mongoose";

const pendingOrganisationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    baseCountry: { type: String, required: true },
    password: { type: String, required: true },
    contact: {
      email: { type: String, required: true, unique: true },
    },
    verificationToken: { type: String, required: true },

    socialMedia: {
      instagram: { type: String, unique: true, sparse: true }, // optional, only for unregistered NGOs
    },
  },
  { timestamps: true }
);

export default mongoose.model("PendingOrganisation", pendingOrganisationSchema);
