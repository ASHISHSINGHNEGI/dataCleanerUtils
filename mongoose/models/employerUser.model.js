import { model, Schema } from "mongoose";

const employerUserSchema = new Schema(
  {
    // default section
    userType: {
      type: String,
      default: "employer",
    },
    // Basic Information
    fullName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
      unique: true,
    },
    registrationNumber: {
      type: String,
      unique: true,
    },
    company: {
      name: String,
      id: String,
    },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
    },

    licenseNumber: {
      type: String,
    },

    status: { type: Boolean, default: false },
    website: String,

    // Profile Status
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    acceptedPolicies: [
      {
        type: { type: String, required: true },
        version: { type: Number, required: true },
        acceptedAt: { type: Date, default: Date.now },
      },
    ],
    // Profile Media
    profilePic: {
      type: {
        docType: {
          type: String,
          required: true,
        },
        fileName: {
          type: String,
          required: true,
        },
        mediaAssetId: {
          type: Schema.Types.ObjectId,
          ref: "mediaassets",
        },
        s3Key: {
          type: String,
        },
      },
      required: false,
    },

    gender: {
      type: String,
    },

    // Referral System
    referralCode: {
      type: String,
      unique: true,
    },
    sub: {
      type: String,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
);

export const employerUserModel = model("employeruser", employerUserSchema);
