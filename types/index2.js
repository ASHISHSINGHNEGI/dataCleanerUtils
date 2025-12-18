import { Document, Types } from "mongoose";

// ==========================================
// COMMON TYPES
// ==========================================

export type ObjectId = Types.ObjectId;

export interface TimestampFields {
    createdAt: Date;
    updatedAt: Date;
}

export interface DocumentFile {
    fileName: string;
    fileType: string;
}

// ==========================================
// USER TYPES
// ==========================================

export interface UserTag {
    id: ObjectId;
    name: string;
}

export interface User extends TimestampFields {
    _id: ObjectId;
    phoneNumber: string;
    userType: string;
    isProfileCompleted: boolean;
    accecptedTermsAndCond: boolean;
    tags: UserTag[];
    specialization: string;
}

export type UserType = "NURSE_CANDIDATE";

// ==========================================
// COMPANY TYPES
// ==========================================

export interface CompanyAddress {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

export interface Company extends TimestampFields {
    _id: ObjectId;
    name: string;
    nameRef: string;
    description?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: CompanyAddress;
    industry?: string;
    foundedYear?: number;
    isActive: boolean;
}

// ==========================================
// JOB TYPES
// ==========================================

export const NURSE_ROLES = [
    "Adult-Gerontology Nurse Practitioner (AGNP)",
    "Registered Nurse (RN)",
    "Critical Care Registered Nurse (CCRN)",
    "Licensed Practical Nurse (LPN)",
    "Clinical Nurse Specialist (CNS)",
    "Emergency Room Registered Nurse (ERRN)",
    "Licensed Vocational Nurse (LVN)",
    "Certified Registered Nurse Anesthetist (CRNA)",
    "Cardiac Registered Nurse",
    "Family Nurse Practitioner (FNP)",
    "Rehabilitation Registered Nurse",
    "Nurse Anesthesia Practice (DNAP)",
    "Plastic Surgery Registered Nurse",
    "Bariatric Registered Nurse",
    "Radiology Registered Nurse",
    "Certified Nursing Assistant (CNA)",
    "Nurse Educator",
    "ICU Registered Nurse",
    "Labor and Delivery Nurse",
    "Orthopedic Registered Nurse",
    "Registered Mental Health Nurse",
    "Public Health Registered Nurse",
    "Oncology Registered Nurse",
    "Health Informatics Nurse Specialist",
    "Home Care Registered Nurse",
    "Clinical Nurse Supervisor",
    "Medical-Surgical Registered Nurse",
    "Nursing Administrator",
    "Post-Anesthesia Care Unit (PACU) Nurse",
    "Travel Registered Nurse",
    "Certified Nurse-Midwife",
    "Forensic Registered Nurse",
    "Military Registered Nurse",
    "School Nurse",
    "Certified Managed Care Nurse (CMCN)",
    "Pediatric Care Registered Nurse",
    "Women's Health Nurse Practitioner (WHNP)",
    "Neonatal Nurse",
    "Psychiatric Mental Health Nurse Practitioner (PMHNP)",
] as const;

export type NurseRole = (typeof NURSE_ROLES)[number];

export const JOB_TYPES = [
    "FULL-TIME",
    "PART-TIME",
    "CONTRACT",
    "INTERNSHIP",
    "FREELANCE",
    "REMOTE",
] as const;

export type JobType = (typeof JOB_TYPES)[number];

export const JOB_STATUS = [
    "DRAFT",
    "UNDER_REVIEW",
    "PUBLISHED",
    "HIDDEN",
    "DELETED",
] as const;
export type JobStatus = (typeof JOB_STATUS)[number];

export const JOB_SOURCES = [
    "DIRECT",
    "REFERRAL",
    "JOB_BOARD",
    "SOCIAL_MEDIA",
    "COMPANY_WEBSITE",
    "RECRUITER",
] as const;
export type JobSourceType = (typeof JOB_SOURCES)[number];

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
] as const;

export type JobApplicationStatusType = (typeof JOB_APPLICATION_STATUS)[number];
export type ExperienceLevel = "JUNIOR" | "MID" | "SENIOR" | "LEAD";

export interface JobLocation {
    city: string;
    state: string;
    country: string;
    remote: boolean;
}

export interface JobExperience {
    years?: number;
    level?: ExperienceLevel;
}

export interface JobSalary {
    min?: number;
    max?: number;
    currency: string;
}

export interface JobCompany {
    name?: string;
    id: ObjectId;
}

export interface JobRole {
    name: string;
    id: ObjectId;
}

export interface Job extends TimestampFields {
    _id: ObjectId;
    userId: ObjectId;
    title: string;
    description?: string;
    type: JobType;
    category?: string;
    location: JobLocation;
    skills: string[];
    qualifications: string[];
    experienceRequired?: JobExperience;
    status: JobStatus;
    deletedAt?: Date;
    reviewedAt?: Date;
    salary?: JobSalary;
    company: JobCompany;
    jobRole: JobRole;
}

// ==========================================
// JOB ROLES TYPES
// ==========================================

export interface JobRoles extends TimestampFields {
    _id: ObjectId;
    title: string;
    description?: string;
    averageSalary?: number;
    qualifications: string[];
    experienceRequired?: string;
    isActive: boolean;
    countryId: ObjectId;
}

// ==========================================
// COUNTRIES TYPES
// ==========================================

export interface Countries extends TimestampFields {
    _id: ObjectId;
    name: string;
    code?: string;
    flag?: DocumentFile;
    images?: DocumentFile[];
    videos?: DocumentFile[];
}

// ==========================================
// EVENT TYPES
// ==========================================

export type EventType = "IN_PERSON" | "VIRTUAL" | "HYBRID";

export type AttendeeStatus = "pending" | "accepted" | "declined" | "maybe";

export interface EventLocation {
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    lat?: number;
    lng?: number;
}

export interface EventAttendee {
    name?: string;
    email?: string;
    status?: AttendeeStatus;
}

export interface Event extends TimestampFields {
    _id: ObjectId;
    heading: string;
    subheading?: string;
    url?: string;
    userId: ObjectId;
    role: string;
    startDate: Date;
    startTime?: string;
    endTime?: string;
    timezone: string;
    allDay: boolean;
    type: EventType;
    meetingLink?: string;
    description?: string;
    location?: EventLocation;
    attendees?: EventAttendee[];
}

// ==========================================
// FEED TYPES
// ==========================================

export type MediaType = "image" | "video";

export const FEED_VISIBILITY = [
    "public",
    "private",
    "friends",
    "followers",
    "custom",
] as const;

export type FeedVisibility = (typeof FEED_VISIBILITY)[number];

export interface Media {
    url: string;
    type: MediaType;
    mime?: string;
    width?: number;
    height?: number;
    durationSec?: number;
    sizeBytes?: number;
}

export interface Feed extends TimestampFields {
    _id: ObjectId;
    userId: ObjectId;
    content?: string;
    media: Media[];
    tags: string[];
    mentions: ObjectId[];
    visibility: FeedVisibility;
    allowedViewers: ObjectId[];
    likesCount: number;
    commentsCount: number;
}

// ==========================================
// SPOTLIGHT TYPES
// ==========================================

export type SpotlightType =
    | "story"
    | "announcement"
    | "event"
    | "tip"
    | "other";

export interface Spotlight extends TimestampFields {
    _id: ObjectId;
    userId: ObjectId;
    role: string;
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    linkUrl?: string;
    type: SpotlightType;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
    order: number;
}

// ==========================================
// TAG TYPES
// ==========================================

export interface Tag extends TimestampFields {
    _id: ObjectId;
    name: string;
    refName: string;
    count: number;
}

// ==========================================
// STAGES TYPES
// ==========================================

export interface Stages extends TimestampFields {
    _id: ObjectId;
    jobRoleId: ObjectId;
    description?: string;
    order?: number;
    estimatedTime?: string;
    isMandatory?: boolean;
    taskType?: string;
    actionBy?: string;
    name: string;
}

// ==========================================
// TASKS TYPES
// ==========================================

export type WhoFilledRole = "self" | "admin";

export interface WhoFilled {
    role?: WhoFilledRole;
    userId?: ObjectId;
}

export interface TasksData extends TimestampFields {
    _id: ObjectId;
    candidateId: ObjectId;
    countryId: ObjectId;
    jobRoleId: ObjectId;
    stageId: ObjectId;
    taskId: ObjectId;
    whoFilled?: WhoFilled;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginationParams {
    page?: string;
    limit?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination?: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

// ==========================================
// QUERY FILTER TYPES
// ==========================================

export interface JobFilters extends PaginationParams {
    status?: JobStatus;
    type?: JobType;
    category?: NurseRole;
    location?: string;
    remote?: boolean;
    minSalary?: number;
    maxSalary?: number;
    experienceLevel?: ExperienceLevel;
}

export interface EventFilters extends PaginationParams {
    status?: string;
    type?: EventType;
    fromDate?: string;
    toDate?: string;
}

export interface FeedFilters extends PaginationParams {
    userId?: ObjectId;
    visibility?: FeedVisibility;
    tags?: string[];
}

// ==========================================
// REQUEST BODY TYPES
// ==========================================

export interface CreateJobRequest {
    title: string;
    description?: string;
    type: JobType;
    category?: NurseRole;
    location: JobLocation;
    skills?: string[];
    qualifications?: string[];
    experienceRequired?: JobExperience;
    salary?: JobSalary;
    company: JobCompany;
    jobRole: JobRole;
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
    status?: JobStatus;
}

export interface CreateEventRequest {
    heading: string;
    subheading?: string;
    url?: string;
    role: string;
    startDate: Date;
    startTime?: string;
    endTime?: string;
    timezone?: string;
    allDay?: boolean;
    type: EventType;
    meetingLink?: string;
    description?: string;
    location?: EventLocation;
    attendees?: EventAttendee[];
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> { }

export interface CreateFeedRequest {
    content?: string;
    media?: Media[];
    tags?: string[];
    mentions?: ObjectId[];
    visibility?: FeedVisibility;
    allowedViewers?: ObjectId[];
}

export interface UpdateFeedRequest extends Partial<CreateFeedRequest> { }

export interface CreateSpotlightRequest {
    role: string;
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    linkUrl?: string;
    type?: SpotlightType;
    isActive?: boolean;
    startDate?: Date;
    endDate?: Date;
    order?: number;
}

export interface UpdateSpotlightRequest
    extends Partial<CreateSpotlightRequest> { }

export interface CreateTasksDataRequest {
    candidateId: ObjectId;
    countryId: ObjectId;
    jobRoleId: ObjectId;
    stageId: ObjectId;
    taskId: ObjectId;
    whoFilled?: WhoFilled;
}

export interface UpdateTasksDataRequest
    extends Partial<CreateTasksDataRequest> { }

// ==========================================
// AUTHORIZER TYPES
// ==========================================

export interface UserPool {
    UserPoolId: string;
    ClientId: string;
}

export interface AuthorizerContext {
    principalId: string;
    policyDocument: {
        Version: string;
        Statement: Array<{
            Action: string;
            Effect: string;
            Resource: string;
        }>;
    };
    context?: {
        userId?: string;
        email?: string;
        [key: string]: any;
    };
}

// ==========================================
// UTILITY TYPES
// ==========================================

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> &
    Partial<Pick<T, K>>;

export type docDetails = {
    fileName: string;
    fileUrl?: string; // stored in S3 or similar
    docType: string;
    uploadedAt?: Date;
};

export const BUCKET_TYPES = ["PUBLIC", "PRIVATE"] as const;
export type BucketType = (typeof BUCKET_TYPES)[number];

export interface IDocumentMapper {
    label: string;
    bucketType: BucketType;
    collectionName: string;
    category?: string;
    docType: string;
    docTypeRef?: string;
    allowedFileTypes: string[];
    maxSizeMB?: number;
    retentionPolicy?: string;
    description?: string;
    version?: number;
    key?: string; // represent the key in collection where this document is linked
}

export const TASK_STATUS = [
    "PENDING",
    "ONGOING",
    "UNDER_REVIEW",
    "COMPLETED",
    "REJECTED",
] as const;

export type TTaskStatus = (typeof TASK_STATUS)[number];

export const DOCUMENT_STATUS = [
    "PENDING_UPLOAD",
    "URL_GENERATED",
    "UPLOADED",
    "VERIFIED",
    "ACTIVE",
    "EXPIRED",
    "DELETED",
] as const;

export type DocumentStatusType = (typeof DOCUMENT_STATUS)[number];

export const MEDIA_FORM = ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT"];
export type MediaFormType = (typeof MEDIA_FORM)[number];

export const PUBLIC_DOCUMENTS = [
    "PROFILE_PICTURE",
    "PUBLIC_DOCUMENT",
    "SHARED_RESOURCE",
] as const;
export type PublicDocumentType = (typeof PUBLIC_DOCUMENTS)[number];

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
] as const;

export type DocumentType = (typeof DOCUMENT_LIST)[number];

export const FEED_STATUS = [
    "DRAFT",
    "UNDER_REVIEW",
    "PUBLISHED",
    "HIDDEN",
    "DELETED",
] as const;

export type FeedStatusType = (typeof FEED_STATUS)[number];

export const FEED_CONTENT_TYPE = [
    "text",
    "mention",
    "emoji",
    "hashtag",
] as const;

export type FeedContentType = (typeof FEED_CONTENT_TYPE)[number];

export const GENDER_OPTIONS = [
    "male",
    "female",
    "other",
    "notSpecified",
    "any",
] as const;
export type GenderType = (typeof GENDER_OPTIONS)[number];

export const LANGUAGE_LEVEL = ["BASIC", "GOOD", "FLUENT", "NATIVE"];
export type LanguageLevelType = (typeof LANGUAGE_LEVEL)[number];
export const CALL_DISPOSITION = [
    "CALL_ATTEMPT_NO_ANSWER",
    "CALL_ATTEMPT_NOT_REACHABLE",
    "CALL_ATTEMPT_WRONG_NUMBER",
    "CALL_ATTEMPT_BUSY_DECLINED",
    "VOICEMAIL_SENT",
    "FOLLOW_UP_SCHEDULED",
    "CONNECTED_SCREENING_COMPLETED",
    "CONNECTED_INTERESTED",
    "CONNECTED_NOT_INTERESTED",
    "CONNECTED_REQUESTED_CALLBACK",
    "CONNECTED_NEEDS_MORE_INFO",
    "QUALIFIED_MEETS_ALL_CRITERIA",
    "PARTIALLY_QUALIFIED_MISSING_DOCUMENTS",
    "PARTIALLY_QUALIFIED_MISSING_EXPERIENCE",
    "NOT_QUALIFIED",
    "UNDER_REVIEW_VERIFICATION_IN_PROGRESS",
    "DOCUMENTS_SUBMITTED_PENDING_REVIEW",
    "DOCUMENTS_APPROVED",
    "DOCUMENTS_REJECTED_REUPLOAD_REQUIRED",
    "VERIFICATION_COMPLETED",
    "VERIFICATION_FAILED",
    "INTERVIEW_SCHEDULED",
    "INTERVIEW_RESCHEDULED",
    "INTERVIEW_COMPLETED_SELECTED",
    "INTERVIEW_COMPLETED_ON_HOLD",
    "INTERVIEW_COMPLETED_REJECTED",
    "CANDIDATE_NO_SHOW_INTERVIEW",
    "OFFER_EXTENDED",
    "OFFER_ACCEPTED",
    "OFFER_DECLINED",
    "ONBOARDING_INITIATED",
    "ONBOARDING_COMPLETED",
    "CANDIDATE_UNRESPONSIVE",
    "CANDIDATE_WITHDREW_APPLICATION",
    "CANDIDATE_JOINED_ANOTHER_EMPLOYER",
    "DUPLICATE_APPLICATION",
    "APPLICATION_CLOSED_BY_EMPLOYER",
    "VISA_DOCUMENTATION_STARTED",
    "VISA_APPROVED",
    "TRAVEL_SCHEDULED",
    "CANDIDATE_DEPLOYED",
    "DEPLOYMENT_DELAYED",
];
export type CallDispositionType = (typeof CALL_DISPOSITION)[number];

export type TNursingProgramSpecialization =
    keyof typeof nursingProgramsSpecializations;

export const QUERY_LIFECYCLE = [
    "DRAFT",
    "SUBMITTED",
    "RECEIVED",
    "IN_PROGRESS",
    "NEED_USER_INFO",
    "RESUBMITTED",
    "ESCALATED",
    "ANSWERED",
    "REJECTED",
    "CLOSED",
    "ARCHIVED",
] as const;
export type QueryLifecycle = (typeof QUERY_LIFECYCLE)[number];

export const QUERY_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
export type QueryPriority = (typeof QUERY_PRIORITIES)[number];

export const NURSING_QUERY_CATEGORIES = [
    "Academic Learning",
    "Clinical Practice and Skills",
    "Case Studies and Scenarios",
    "Professional Development",
    "Hospital or Internship Related",
    "Legal and Ethical Concerns",
    "Technology in Nursing",
    "OTHER",
] as const;
export type NursingQueryCategory = (typeof NURSING_QUERY_CATEGORIES)[number];

export const nursingProgramsSpecializations = {
    ANM: "Auxiliary Nurse & Midwife",
    GNM: "General Nursing & Midwifery",
    BSC: "B. Sc (Basic)",
    PB_BSC: "B.Sc (Post Basic)",
    MSC: "M. Sc.",
    MPHIL: "M. Phil",
    PHD: "Ph D",
    PB_ORN: "Post Basic Diploma in Operation Room Nursing",
    PB_CTN: "Post Basic Diploma in Cardio Thoracic Nursing",
    PB_NN: "Post Basic Diploma in Neurology Nursing",
    PB_MN: "Post Basic Diploma in Midwifery Nursing",
    PB_PN: "Post Basic Diploma in Psychiatric Nursing",
    PB_CCN: "Post Basic Diploma in Critical Care Nursing",
    PB_EDN: "Post Basic Diploma in Emergency & Disaster Nursing",
    PB_ON: "Post Basic Diploma in Oncology Nursing",
    PB_ORN_REHAB: "Post Basic Diploma in Ortho and Rehabilitation Nursing",
    PB_GN: "Post Basic Diploma in Geriatric Nursing",
    PB_NN2: "Post Basic Diploma in Neonatal Nursing",
    PB_FN: "Post Basic Diploma in Forensic Nursing",
    PB_HN: "Post Basic Diploma in Haematology Nursing-Residency Programme",
    PB_BRSN:
        "Post Basic Diploma in Burn & Reconstructive Surgery Nursing – Residency Programme",
    NPCC: "Nurse Practitioner in Critical Care",
};
