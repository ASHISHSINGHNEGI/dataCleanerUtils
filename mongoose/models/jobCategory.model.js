import mongoose from "mongoose";
import { sanitizeFilename } from "../../helpers/sanitizeFilename.js";
const jobCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    refCode: {
      type: String,
      unique: true,
      index: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 500,
    },
    status: {
      type: String,
      default: "PUBLISHED",
      enum: ["PUBLISHED", "DRAFT", "DELETED"],
    },
  },
  {
    timestamps: true,
    _id: true,
  }
);

jobCategorySchema.pre("save", async function () {
  if (this.isNew && !this.refCode) {
    this.refCode = sanitizeFilename(this.name);
  }
});

export const JobCategory = mongoose.model("JobCategory", jobCategorySchema);
