import mongoose, { Schema } from "mongoose";

export const EducationDetailSchema = new Schema(
  {
    institutionName: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    grade: { type: String },
    description: { type: String },
    isOngoing: { type: Boolean, default: false },
  },
  { strict: true }
);

export const EducationDetail = mongoose.model(
  "EducationDetail",
  EducationDetailSchema
);
