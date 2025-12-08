import { Schema, model } from "mongoose";
import { BUCKET_TYPES, DOCUMENT_STATUS, MEDIA_FORM } from "../../types";

const MediaAssetSchema = new Schema(
  {
    fileName: { type: String, required: true },
    mediaForm: { type: String, required: true, enum: MEDIA_FORM },
    docType: { type: String, required: true },
    bucketType: { type: String, required: true, enum: BUCKET_TYPES },
    linkedTo: { type: Schema.Types.Mixed, default: {} },
    s3Key: String,
    status: {
      type: String,
      enum: DOCUMENT_STATUS,
      default: "PENDING_UPLOAD",
    },
  },
  { timestamps: true, _id: true }
);

// Add TTL index for automatic cleanup of orphaned records
MediaAssetSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 86400, // 24 hours
    partialFilterExpression: { status: "URL_GENERATED" },
  }
);

export const MediaAsset = model("MediaAsset", MediaAssetSchema);
