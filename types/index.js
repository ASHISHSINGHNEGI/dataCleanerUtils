export const JOB_APPLICATION_STATUS = [
  "APPLICATION_INITIATED", // Initial application started but not fully submitted
  "APPLICATION_SUBMITTED", // Application is fully completed and submitted
  "UNDER_REVIEW", // Application is being reviewed by the hiring team
  "SHORTLISTED", // Candidate has passed initial screening
  "INTERVIEW_SCHEDULED", // An interview has been scheduled
  "INTERVIEW_COMPLETED", // Interview process for a specific round has been completed
  "ADVANCED_TO_ROUND_2", // Candidate has moved to the second round of interviews
  "ADVANCED_TO_ROUND_3", // Candidate has moved to the third round of interviews
  "ADVANCED_TO_FINAL_ROUND", // Candidate has moved to the final round of interviews
  "OFFER_EXTENDED", // A job offer has been extended to the candidate
  "OFFER_ACCEPTED", // The candidate has accepted the job offer
  "APPLICATION_REJECTED", // The application has been rejected
  "APPLICATION_WITHDRAWN", // The candidate has withdrawn their application
  "ON_HOLD", // The application process is temporarily paused
  "APPLICATION_EXPIRED", // The application or job posting has expired
];
export const DOCUMENT_LIST = [
  "profilePic",
  "coverletter",
  "transcript",
  "license",
  "resume", //changing this on demand
  "aadhaar",
  "pan",
  "passport",
  "drivingLicense",
  "voterCard",
  "feedImage",
  "feedVideo",
  "feedDocument",
  "queryTicket",
  "reelImage",
  "reelVideo",
  "countryImage",
  "countryVideo",
  "countryFlag",
  "task",
  "portfolio",
  "certificate",
];

export const DOCUMENT_STATUS = [
  "PENDING_UPLOAD",
  "URL_GENERATED",
  "UPLOADED",
  "VERIFIED",
  "ACTIVE",
  "EXPIRED",
  "DELETED",
];

export const MEDIA_FORM = ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT"];
export const BUCKET_TYPES = ["PUBLIC", "PRIVATE"];
export const GENDER_OPTIONS = [
  "male",
  "female",
  "other",
  "notSpecified",
  "any",
];

export const JOB_STATUS = [
  "DRAFT",
  "UNDER_REVIEW",
  "PUBLISHED",
  "HIDDEN",
  "DELETED",
];

export const LANGUAGE_LEVEL = ["BASIC", "GOOD", "FLUENT", "NATIVE"];

export const JOB_TYPES = [
  "FULL-TIME",
  "PART-TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
  "REMOTE",
];
