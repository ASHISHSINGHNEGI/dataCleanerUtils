import mongoose, { Schema } from "mongoose";

const membershipSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    communityId: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["member", "moderator", "admin"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "banned", "pending", "invited", "left"],
      default: "active",
    },
    leftAt: { type: Date },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

// Ensure a user can join a community only once
membershipSchema.index({ userId: 1, communityId: 1 }, { unique: true });

export const communityMembership = mongoose.model(
  "communityMembership",
  membershipSchema
);
