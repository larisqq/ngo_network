//models/PendingOrganisation.js
import mongoose from "mongoose";

const pendingOrganisationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    password: { type: String, required: true },
    contact: {
      email: { type: String, required: true, unique: true },
    },
    verificationToken: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("PendingOrganisation", pendingOrganisationSchema);
