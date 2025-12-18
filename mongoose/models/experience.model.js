import { JOB_TYPES } from "../../types/index.js";
import mongoose, { Schema } from "mongoose";

export const ExperienceDetailSchema = new Schema(
  {
    companyName: { type: String, required: true },
    position: { type: String, required: true },
    employmentType: {
      type: String,
      enum: JOB_TYPES,
      default: "FULL-TIME",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrentJob: { type: Boolean, default: false },
    location: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

export const ExperienceDetail = mongoose.model(
  "ExperienceDetail",
  ExperienceDetailSchema
);
