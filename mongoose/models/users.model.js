import mongoose, { Schema } from "mongoose";
import { ensureMembership } from "../../helpers/ensureMembership.js";
import { findOrCreateCommunity } from "../../helpers/findOrCreateCommunity.js";
import { logger } from "../../helpers/logger.js";
import { GENDER_OPTIONS } from "../../types/index.js";
import { EducationDetailSchema } from "./education.model.js";
import { ExperienceDetailSchema } from "./experience.model.js";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    fullName: {
      type: String,
      trim: true,
      // description: "Full name of the user",
    },
    phoneNumber: {
      type: String,
      // required: true, //comment it so that superadmin can be created in db bec superadmin can be created with just email also
      unique: true,
      // description:
      // "Unique phone number for user identification and communication",
    },
    secondaryContactNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    secondaryEmail: {
      type: String,
    },
    userType: {
      type: String,
      default: "NURSE_CANDIDATE",
      // description: "Type of user, defaults to NURSE_CANDIDATE",
    },

    // Profile Status
    isProfileCompleted: {
      type: Boolean,
      default: false,
      // description: "Indicates if user has completed their profile",
    },
    acceptedTermsAndCond: {
      type: Boolean,
      default: false,
      // description: "Indicates if user has accepted terms and conditions",
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
          // description: "Type of profile picture document",
        },
        fileName: {
          type: String,
          required: true,
          // description: "Filename of the profile picture",
        },
        mediaAssetId: {
          type: Schema.Types.ObjectId,
          ref: "mediaassets",
          // description: "Reference to the media asset for the profile picture",
        },
        s3Key: {
          type: String,
        },
      },
      required: false,
      // description: "Profile picture details",
    },

    // Professional Details
    specialization: {
      type: String,
      // default: "General Nurse",
      // description: "Nursing specialization",
    },
    skills: {
      type: [String],
      default: [],
      // description: "List of professional skills",
    },
    experienceType: {
      type: String,
      // description: "Type of experience (e.g., Fresh, Experienced)",
    },

    // Location & Language
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      country: { type: String, trim: true },
      pincode: { type: String, trim: true },
      // description: "User's current location details",
    },
    language: {
      motherTongue: { type: String },
      other: [String],
      // description: "Language proficiency details",
    },

    // Target Countries & Roles
    targetCountry: {
      name: { type: String },
      id: {
        type: Schema.Types.ObjectId,
        ref: "countries",
      },
      // description: "Primary target country for employment",
    },
    secondaryCountries: [
      {
        name: { type: String },
        id: {
          type: Schema.Types.ObjectId,
          ref: "countries",
        },
        // description: "Secondary target countries for employment",
      },
    ],
    targetJobRole: {
      name: { type: String },
      id: {
        type: Schema.Types.ObjectId,
        ref: "jobroles",
      },
      // description: "Primary target job role",
    },
    secondaryJobRoles: [
      {
        name: { type: String },
        id: {
          type: Schema.Types.ObjectId,
          ref: "jobroles",
        },
        // description: "Secondary target job roles",
      },
    ],

    // Qualifications & Experience
    education: {
      type: [EducationDetailSchema],
      // description: "Educational qualification details",
    },
    experience: {
      type: [ExperienceDetailSchema],
      // description: "Work experience details",
    },

    // Documents & Tags
    documents: [
      {
        mediaAssetId: {
          type: Schema.Types.ObjectId,
          ref: "mediaassets",
        },
        s3Key: {
          type: String,
        },
        fileName: String,
        docType: String,
      },
    ],
    tags: [
      {
        id: { type: Schema.Types.ObjectId, ref: "Tag" },
        name: String,
        // description: "Associated tags for the user",
      },
    ],

    // Community
    community: [
      {
        name: { type: String },
        communityId: {
          type: Schema.Types.ObjectId,
          ref: "Communities",
        },
        // description: "Communities the user belongs to",
      },
    ],

    // Personal Information
    dob: {
      type: Date,
      // description: "Date of birth",
    },
    gender: {
      type: String,
      enum: GENDER_OPTIONS,
      // description: "Gender of the user",
    },

    // Referral System
    referralCode: {
      type: String,
      // description: "Unique referral code for the user",
    },
    sub: {
      // this value represent the sub value prensent in cognito
      type: String,
    },
    passportNumber: String,
  },
  {
    // strict: "throw",
    _id: true,
    timestamps: true,
    // description: "Schema for storing nurse candidate user information",
  }
);

// 2) Query updates: after updates, fetch the updated user(s) and ensure community + membership
// We use post hooks so the DB update has already applied and we can read the final values.
userSchema.post(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  async function () {
    console.log("updating user details:", this.getQuery());
    try {
      const query = this.getQuery(); // the filter used in the update
      if (!query) {
        console.log("query not found");
        return;
      }
      //check the existence of user
      const users = await mongoose.model("User").find(query);
      console.log(`${users.length} User found in db`);
      for (const user of users) {
        console.log("updating user with _id: ", user._id);
        const { fullName, referralCode } = user;
        const country = user.targetCountry?.name;
        const job = user.targetJobRole?.name;
        logger({
          targetCountry: country,
          targetJobRole: job,
          fullName,
          referralCode,
        });

        if (fullName && !referralCode) {
          logger({
            message: " full name  found and referral code is not present",
          });
          console.log("Generating referral code...");
          const referralCode =
            fullName?.slice(0, 4) + (await generateUniqueCode());
          logger({ message: "Referral code generated:", referralCode });
          const result = await User.findByIdAndUpdate(
            { _id: user._id },
            {
              $set: {
                referralCode,
              },
            },
            {
              new: true,
            }
          );
          logger({ message: "code updated in user record", data: result });
        }

        if (!country || !job) continue;

        const community = await findOrCreateCommunity(job, country);
        logger({ community });
        if (!community) continue;

        await ensureMembership(user._id, community._id);
        // Update the user document in DB to include the community if not present
        // await addCommunityToUserById(user._id, community, user);
      }
    } catch (err) {
      // log but do not throw (post hooks shouldn't break the original update)
      console.error("post-update community sync error:", err);
      throw err;
    }
  }
);

async function generateUniqueCode() {
  return await checkForExistingCode(
    Math.random().toString(36).substring(2, 6).toUpperCase()
  );
}

async function checkForExistingCode(code) {
  let existingUser = await User.findOne({ referralCode: code });
  if (existingUser) {
    return await generateUniqueCode();
  }
  return code;
}

export const User = mongoose.models.User || mongoose.model("User", userSchema);
