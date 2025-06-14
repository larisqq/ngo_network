import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    domains: [
      {
        type: String,
      },
    ],
    password: {
      type: String,
      required: true,
    },
    contact: {
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
      whatsapp: {
        type: String,
      },
    },
    socialLinks: {
      facebook: {
        type: String,
      },
      instagram: {
        type: String,
      },
      website: {
        type: String,
      },
    },
    coordinators: [
      {
        name: {
          type: String,
          required: true,
        },
        photo: {
          type: String,
        },
        role: {
          type: String,
        },
        email: {
          type: String,
        },
      },
    ],
    erasmusProjects: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        domains: [
          {
            type: String,
          },
        ],
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Organisation", organisationSchema);
