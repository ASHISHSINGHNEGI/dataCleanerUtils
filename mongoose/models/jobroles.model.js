import mongoose, { Schema } from "mongoose";

const JobRolesSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    jobCategory: {
      type: Schema.Types.ObjectId,
      ref: "JobCategory",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    otherSkills: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const JobRoles =
  mongoose.models.JobRoles || mongoose.model("JobRoles", JobRolesSchema);
