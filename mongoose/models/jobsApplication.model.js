import mongoose, { Schema } from "mongoose";
import { DOCUMENT_LIST, JOB_APPLICATION_STATUS } from "../../types/index.js";
// import { DOCUMENT_LIST, JOB_APPLICATION_STATUS, JOB_TYPES } from "@/types";

const AppliedJobsSchema = new Schema(
  {
    // ------------------
    // APPLICANT INFO
    // ------------------
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ------------------
    // JOB REFERENCE
    // ------------------
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    // Store job details at time of application (in case job gets modified/deleted)
    jobSnapshot: Schema.Types.Mixed,
    // ------------------
    // APPLICATION STATUS
    // ------------------
    applicationStatus: {
      type: String,
      enum: JOB_APPLICATION_STATUS,
      default: "APPLICATION_INITIATED",
      required: true,
      index: true,
    },

    // ------------------
    // APPLICATION DETAILS
    // ------------------
    coverLetter: {
      type: String,
      trim: true,
      maxlength: 5000, // Limit cover letter length
    },

    resume: {
      filename: { type: String },
      docType: { type: String, enum: DOCUMENT_LIST },
      uploadedAt: { type: Date, default: Date.now },
      mediaAssetId: {
        type: Schema.Types.ObjectId,
        ref: "mediaassets",
      },
      s3Key: {
        type: String,
      },
    },

    //we will keep any docs here releted to the job application and also mandatory docs also
    additionalDocuments: [
      {
        filename: { type: String },
        documentType: {
          type: String,
        },
        uploadedAt: { type: Date, default: Date.now },
        mediaAssetId: {
          type: Schema.Types.ObjectId,
          ref: "mediaassets",
        },
        docId: {
          type: Schema.Types.ObjectId,
          ref: "DocumentMapper",
          required: true,
        },
        s3Key: {
          type: String,
        },
      },
    ],
    mandatoryQuestions: [
      {
        question: { type: String },
        answer: { type: String },
      },
    ],

    // ------------------
    // INTERVIEW & COMMUNICATION
    // ------------------
    interviews: [
      {
        type: {
          type: String,
        },
        scheduledAt: { type: Date },
        completedAt: { type: Date },
        duration: { type: Number }, // in minutes
        interviewerName: { type: String },
        interviewerEmail: { type: String },
        notes: { type: String, maxlength: 2000 },
        feedback: { type: String, maxlength: 2000 },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        status: {
          type: String,
          enum: ["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"],
          default: "SCHEDULED",
        },
      },
    ],

    communications: [
      {
        type: {
          type: String,
        },
        direction: {
          type: String,
          enum: ["INCOMING", "OUTGOING"],
          required: true,
        },
        subject: { type: String },
        message: { type: String, required: true },
        fromEmail: { type: String },
        toEmail: { type: String },
        timestamp: { type: Date, default: Date.now },
        isRead: { type: Boolean, default: false },
      },
    ],

    // ------------------
    // SALARY & NEGOTIATIONS
    // ------------------
    expectedSalary: {
      min: { type: Number, min: 0 },
      max: { type: Number, min: 0 },
      currency: { type: String, default: "INR" },
    },

    offeredSalary: {
      amount: { type: Number, min: 0 },
      currency: { type: String, default: "INR" },
      benefits: [{ type: String }],
      negotiable: { type: Boolean, default: true },
    },

    // ------------------
    // IMPORTANT DATES
    // ------------------
    appliedAt: {
      type: Date,
      default: Date.now,
      required: true,
      index: true,
    },

    lastStatusUpdate: {
      type: Date,
      default: Date.now,
    },

    responseDeadline: {
      type: Date,
    },

    startDate: {
      type: Date, // Expected/Actual start date
    },

    // ------------------
    // NOTES & REMINDERS
    // ------------------
    notes: {
      type: String,
    },

    reminders: [
      {
        title: { type: String, required: true },
        description: { type: String },
        dueDate: { type: Date, required: true },
        isCompleted: { type: Boolean, default: false },
        priority: {
          type: String,
          enum: ["LOW", "MEDIUM", "HIGH"],
          default: "MEDIUM",
        },
      },
    ],

    // ------------------
    // METADATA
    // ------------------
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },

    // Track application view by employer
    viewedByEmployer: {
      type: Boolean,
      default: false,
    },

    viewedAt: {
      type: Date,
    },

    // For soft delete
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    strict: "throw",
    _id: true,
  }
);

// ------------------
// COMPOUND INDEXES
// ------------------
AppliedJobsSchema.index({ userId: 1, jobId: 1 }, { unique: true }); // Prevent duplicate applications
AppliedJobsSchema.index({ userId: 1, applicationStatus: 1 });
AppliedJobsSchema.index({ userId: 1, appliedAt: -1 });
AppliedJobsSchema.index({ jobId: 1, applicationStatus: 1 });
AppliedJobsSchema.index({ appliedAt: -1 }); // For recent applications
AppliedJobsSchema.index({ isActive: 1, isArchived: 1 });

// ------------------
// MIDDLEWARE
// ------------------
// Update lastStatusUpdate when applicationStatus changes
AppliedJobsSchema.pre("save", function () {
  if (this.isModified("applicationStatus")) {
    this.lastStatusUpdate = new Date();
  }
});

// ------------------
// METHODS
// ------------------

AppliedJobsSchema.methods.addReminder = function (
  title,
  description,
  dueDate,
  priority = "MEDIUM"
) {
  this.reminders.push({
    title,
    description,
    dueDate,
    priority,
  });
  return this.save();
};

AppliedJobsSchema.methods.updateStatus = function (newStatus) {
  this.applicationStatus = newStatus;
  this.lastStatusUpdate = new Date();
  return this.save();
};

// ------------------
// STATICS
// ------------------
AppliedJobsSchema.statics.getApplicationsByStatus = function (userId, status) {
  return this.find({
    userId,
    applicationStatus: status,
    isActive: true,
  }).populate("jobId");
};

AppliedJobsSchema.statics.getRecentApplications = function (
  userId,
  limit = 10
) {
  return this.find({
    userId,
    isActive: true,
  })
    .sort({ appliedAt: -1 })
    .limit(limit)
    .populate("jobId");
};

export const AppliedJobs =
  mongoose.models.AppliedJobs ||
  mongoose.model("AppliedJob", AppliedJobsSchema);
