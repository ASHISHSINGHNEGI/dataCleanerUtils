import mongoose, { Schema } from "mongoose";
import { sanitizeFilename } from "../../helpers/sanitizeFilename.js";

export const CommunitySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    refName: { type: String, unique: true, trim: true },
    description: { type: String },
    coverImage: { type: String }, // could be S3 URL
    tags: [{ type: String }],
  },
  { timestamps: true, _id: true }
);

CommunitySchema.pre("save", async function () {
  const community = this;
  if (!community.isModified("name")) return;

  community.refName = sanitizeFilename(community.name);
});

export const Community = mongoose.model("Community", CommunitySchema);
