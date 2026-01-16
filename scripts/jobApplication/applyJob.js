import { AppliedJobs } from "../../mongoose/models/jobsApplication.model.js";
import { checkApplicationCompletionStatus } from "./checkApplicationCompletionStatus.js";
import {
  createAdditionalDocuments,
  createMandatoryQuestions,
  writeApplicationFailureMessage,
  writeApplicationAlreadyExistFailureMessage,
  writeSuccessMessage,
} from "./helpers.js";

export const applyJob = async ({ job, user }) => {
  try {
    // console.log("applyJob function starting");

    // Prepare application data
    const applicationData = {
      userId: user._id,
      jobId: job._id,
      jobSnapshot: job,
      additionalDocuments: createAdditionalDocuments(job.requiredDocuments, []),
      mandatoryQuestions: createMandatoryQuestions(job.mandatoryQuestions, []),
      appliedAt: new Date(),
      lastStatusUpdate: new Date(),
    };

    /* Recalculate application status */
    const isComplete = checkApplicationCompletionStatus({
      applicationDetails: applicationData,
      jobDetails: job,
    });

    applicationData.applicationStatus = isComplete
      ? "APPLICATION_SUBMITTED"
      : "APPLICATION_INITIATED";

    // console.log({
    //   msg: "job application status updated based on completion",
    //   finalStatus: applicationData.applicationStatus,
    // });

    // Create the application
    const appliedJob = new AppliedJobs(applicationData);
    const savedApplication = await appliedJob.save();

    // // Populate the response with job and user details
    // const populatedApplication = await AppliedJobs.findById(
    //     savedApplication._id
    // ).lean();

    // console.log("✅ Application created successfully:", savedApplication._id);
    await writeSuccessMessage({
      message: `job applied job id - ${job._id} userid- ${user._id} , application id: ${savedApplication._id}`,
    });
    return true;
  } catch (error) {
    // console.error(error); // suppressed to avoid noise for handled errors
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      await writeApplicationAlreadyExistFailureMessage({
        message: `Duplicate application: user ${error.keyValue.userId} application for jobid ${error.keyValue.jobId}`,
      });

      console.log(`  -> Already Applied (Duplicate)`);
      return false;
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      await writeApplicationFailureMessage({
        message: `Validation failed ${validationErrors.join(", ")}`,
      });
    }
    // Handle cast errors (invalid ObjectId)
    if (error.name === "CastError") {
      await writeApplicationFailureMessage({
        message: `Invalid ${error.path}: ${error.value}`,
      });
    }
    return false;
  }
};
