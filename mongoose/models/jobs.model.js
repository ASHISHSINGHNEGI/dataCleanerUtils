import mongoose, { Schema } from "mongoose";
import {
  GENDER_OPTIONS,
  JOB_STATUS,
  JOB_TYPES,
  LANGUAGE_LEVEL,
} from "../../types/index.js";

const JobsSchema = new Schema(
  {
    // ------------------
    // CORE JOB DETAILS
    // ------------------
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    responsibilities: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: JOB_TYPES,
      required: true,
    },
    contractPeriod: {
      type: String,
    },
    contractRenewalPolicy: {
      type: String,
    },

    // ------------------
    // LOCATION
    // ------------------
    // job location
    location: {
      city: { type: String, trim: true, index: true },
      state: { type: String, trim: true, index: true },
      country: { type: String, trim: true, index: true },
      remote: { type: Boolean, default: false, index: true },
    },
    status: {
      type: String,
      enum: JOB_STATUS,
      default: "UNDER_REVIEW",
      index: true,
    },
    deletedAt: { type: Date },
    reviewedAt: { type: Date },

    // ------------------
    // SALARY
    // ------------------
    salary: {
      min: { type: Number, min: 0, index: true },
      max: { type: Number, min: 0, index: true },
      currency: { type: String, default: "INR" },
      frequency: {
        type: String,
        enum: ["Monthly", "Weekly", "Yearly", "Daily", "Hourly"],
      },
      deduction: {
        accommodationAllowance: {
          min: { type: Number },
          max: { type: Number },
          currency: { type: String }, //default: "INR"
        },
        medicalInsurance: {
          min: { type: Number },
          max: { type: Number },
          currency: { type: String }, //default: "INR"
        },
      },
    },
    overtimePolicy: { type: String },
    workingConditions: {
      dutyHoursPerDay: { type: Number, minimum: 0 },
      workingDaysPerMonth: { type: Number, minimum: 0 },
      breakTimeIncluded: { type: Boolean },
      leaveBenefits: { type: [String] },
    },
    candidateRequirements: {
      gender: {
        type: String,
        enum: GENDER_OPTIONS,
      },
      ageLimit: {
        min: { type: Number },
        max: { type: Number },
      },
      education: [
        {
          degree: { type: String }, // e.g., B.Tech, M.Sc
          fieldOfStudy: { type: String },
          grade: { type: String },
        },
      ],
      experience: {
        minimumYears: Number,
        description: [String],
      },
      skills: {
        type: [String],
        default: [],
        // description: "List of professional skills",
      },
      languages: [
        {
          name: String, //lang name
          read: { status: Boolean, level: LANGUAGE_LEVEL },
          write: { status: Boolean, level: LANGUAGE_LEVEL },
          speak: { status: Boolean, level: LANGUAGE_LEVEL },
        },
      ],
    },
    facilitiesAndBenefits: {
      food: {
        status: Boolean,
        deductible: Boolean,
        amount: Number,
        currency: String,
      },
      accommodation: {
        status: Boolean,
        deductible: Boolean,
        amount: Number,
        currency: String,
      },
      medical_insurance: {
        status: Boolean,
        deductible: Boolean,
        amount: Number,
        currency: String,
      },
      travel: {
        status: Boolean,
        deductible: Boolean,
        amount: Number,
        currency: String,
      },
      visa: {
        status: Boolean,
        deductible: Boolean,
        amount: Number,
        currency: String,
      },
      passport: {
        status: Boolean,
        deductible: Boolean,
        amount: Number,
        currency: String,
      },
    },
    expensesAndFees: {
      approxExpenses: { status: Boolean, amount: Number, currency: String },
      registrationProcessingFee: {
        status: Boolean,
        amount: Number,
        currency: String,
      },
      registrationProcessingFeeGst: {
        status: Boolean,
        amount: Number,
        currency: String,
      },
    },
    selectionProcess: [
      {
        order: { type: Number, required: true },
        name: { type: String, required: true },
        description: { type: String },
        conductedBy: { type: String }, //name of person conducting the process
        conductedOn: { type: Date },
        location: {
          type: String,
          enum: ["Online", "Offline"],
          default: "Offline",
          index: true,
        },
        address: { type: String },
      },
    ],
    notes: [{ type: String }],
    jobReferralUtm: {
      utm_source: { type: String },
      utm_medium: { type: String },
      utm_campaign: { type: String },
      utm_term: { type: String },
      utm_content: { type: String },
      referrer_id: { type: String },
    },

    mode_of_apply: {
      type: String,
      enum: [
        "Portal",
        "Email",
        "WhatsApp",
        "Walk-in",
        "Agent",
        "Phone",
        "Referral",
        "Offline (Physical Submission)",
        "Other",
      ],
    },
    // ------------------
    // COMPANY INFO
    // ------------------
    company: {
      name: {
        type: String,
        required: true,
        index: true,
      },
      id: {
        type: Schema.Types.ObjectId,
        ref: "Company",
      },
    },

    contact: {
      name: { type: String, trim: true },
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      recruitingAgency: { type: String, trim: true },
    },
    jobRole: {
      name: {
        type: String,
        required: true,
        index: true,
      },
      id: {
        type: Schema.Types.ObjectId,
        ref: "JobRole",
      },
    },
    jobCategory: {
      name: {
        type: String,
        required: true,
        index: true,
      },
      id: {
        type: Schema.Types.ObjectId,
        ref: "JobCategory",
      },
    },

    // ------------------
    // STATUS & DATES
    // ------------------
    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },
    dateOfApplication: {
      type: Date,
      default: Date.now,
    },
    dateOfExpiration: {
      type: Date,
      required: true,
      // validate: {
      //   validator: function (v: Date) {
      //     return v > new Date();
      //   },
      //   message: "Expiration date must be in the future",
      // },
      default: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    positions: {
      type: Number,
      default: 1,
      min: 0,
    },
    positionFilled: {
      type: Number,
      default: 0,
      min: 0,
    },

    //these are the questions that are mandatory for the candidate to answer if question are present in the job
    mandatoryQuestions: [String], //remove the format as per demand

    //these are the documents that are mandatory for the candidate to upload if documents are present in the job
    requiredDocuments: [
      {
        name: { type: String, required: true },
        docId: {
          type: Schema.Types.ObjectId,
          ref: "DocumentMapper",
          required: true,
        },
        description: { type: String },
      },
    ],
  },

  {
    timestamps: true,
    strict: false,
    _id: true,
  }
);

JobsSchema.pre(
  ["findOneAndUpdate", "updateOne", "updateMany"],
  function (next) {
    const update = this.getUpdate();

    if (!update) {
      return next();
    }

    const status = update.$set?.status || update.status;

    if (status === "DELETED") {
      this.set({ deletedAt: new Date() });
    }

    if (status === "PUBLISHED") {
      this.set({ reviewedAt: new Date(), isActive: true });
    }

    next();
  }
);

JobsSchema.index({
  title: "text",
  description: "text",
  "company.name": "text",
  "jobRole.name": "text",
  "jobCategory.name": "text",
});

export const Jobs = mongoose.models.Job || mongoose.model("Job", JobsSchema);
