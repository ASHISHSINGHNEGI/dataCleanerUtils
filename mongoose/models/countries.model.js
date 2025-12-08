import { Schema } from "mongoose";

const DocumentSchema = new Schema({
  fileName: {
    type: String,
    require: true,
  },
  docType: {
    type: String,
  },
  mediaAssetId: {
    type: Schema.Types.ObjectId,
    ref: "mediaassets",
  },
});

const CountriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      trim: true,
    },
    flag: {
      type: DocumentSchema,
    },
    images: {
      type: [DocumentSchema],
    },
    videos: {
      type: [DocumentSchema],
    },
  },
  {
    strict: false,
    timestamps: true,
  }
);

// Update updatedAt timestamp on save
CountriesSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Add virtual for job roles (for population)
CountriesSchema.virtual("jobRoles", {
  ref: "JobRole",
  localField: "_id",
  foreignField: "countryId",
  justOne: false,
});

CountriesSchema.pre("findOneAndUpdate", function (next) {
  logger({ message: "pre  findOneAndUpdate" });
  next();
});

CountriesSchema.post("findOneAndUpdate", function (doc, next) {
  logger({ message: "post findOneAndUpdate" });
  if (typeof next === "function") next();
});

export const Countries = mongoose.model("Country", CountriesSchema);
