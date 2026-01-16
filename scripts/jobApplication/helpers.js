import { Types } from "mongoose";
import { Jobs } from "../../mongoose/models/jobs.model.js";
import { User } from "../../mongoose/models/users.model.js";
import * as fs from "node:fs/promises";

export const validateUser = async ({ userId }) => {
  // console.log("calling validateUser ", userId)
  const user = await User.findOne({ _id: new Types.ObjectId(userId) });
  if (!user) {
    await writeUserFailureMessage({
      message: `function - validateJobAndUser ,User not found ${userId}`,
    });
    return null;
  }
  return user;
};

export const validateJob = async ({ jobId }) => {
  // console.log("calling validateJob- ", jobId)
  const filter = {
    _id: new Types.ObjectId(jobId),
    // isActive: true,
    status: "PUBLISHED",
    // dateOfExpiration: { $gt: new Date() },
  }
  console.log({ filter })
  const job = await Jobs.findOne(filter);
  console.log({ job })
  if (!job) {
    await writeJobFailureMessage({
      message: `Job not found ,jobId- ${jobId} `,
    });
    console.log("Job not found, ");
    return null;
  }
  return job;
};

export const checkJobPositions = (job) => {
  return job.positions - job.positionFilled;
};

//this function will create additional documents based on the job mandatory documents and user input
export const createAdditionalDocuments = (
  requiredDocumentsInJob,
  additionalDocumentsInApplication = []
) => {
  // console.log("📄 [DOC_GEN] Starting createAdditionalDocuments");
  // console.log("📄 Required documents:", requiredDocumentsInJob);
  // console.log(
  //     "📄 Application provided documents:",
  //     additionalDocumentsInApplication
  // );

  const result = [];
  const reqDocs = requiredDocumentsInJob;

  for (let i = 0; i < reqDocs.length; i++) {
    const reqDoc = reqDocs[i];
    console.log(`➡️ Checking required document:`, reqDoc);

    let foundMatch = false;

    for (let j = 0; j < additionalDocumentsInApplication.length; j++) {
      const appDoc = additionalDocumentsInApplication[j];

      if (reqDoc.name === appDoc.documentType) {
        console.log(`✔️ Match found for ${reqDoc.name}:`, appDoc);

        foundMatch = true;

        const isReqFullfilled = appDoc.mediaAssetId && appDoc.filename;
        console.log(
          `   └── Requirement fulfilled:`,
          isReqFullfilled,
          "| filename:",
          appDoc.filename,
          "| mediaAssetId:",
          appDoc.mediaAssetId
        );

        if (isReqFullfilled) {
          result.push({
            filename: appDoc.filename,
            documentType: reqDoc.name,
            docId: reqDoc.docId,
            uploadedAt: null,
            mediaAssetId: new Types.ObjectId(appDoc.mediaAssetId),
            s3Key: null,
          });
        } else {
          result.push({
            filename: null,
            documentType: reqDoc.name,
            docId: reqDoc.docId,
            uploadedAt: null,
            mediaAssetId: null,
            s3Key: null,
          });
        }

        break;
      }
    }

    if (!foundMatch) {
      console.log(`❌ No match found for ${reqDoc.name}. Marking as empty.`);
      result.push({
        filename: null,
        documentType: reqDoc.name,
        docId: reqDoc.docId,
        uploadedAt: null,
        mediaAssetId: null,
        s3Key: null,
      });
    }
  }

  // console.log("📄 [DOC_GEN] Final result:", result);
  return result;
};

// --------------------------------------------------
// MANDATORY QUESTIONS
// --------------------------------------------------
export const createMandatoryQuestions = (
  mandatoryQuestionsFromJob,
  mandatoryQuestionsFromApplication = []
) => {
  // console.log("❓ [Q_GEN] Starting createMandatoryQuestions");
  // console.log("❓ Job questions:", mandatoryQuestionsFromJob);
  // console.log("❓ Application answers:", mandatoryQuestionsFromApplication);

  const result = [];

  for (let i = 0; i < mandatoryQuestionsFromJob.length; i++) {
    const jobQ = mandatoryQuestionsFromJob[i];
    console.log(`➡️ Checking question: "${jobQ}"`);

    let foundMatch = false;

    for (let j = 0; j < mandatoryQuestionsFromApplication.length; j++) {
      const appQ = mandatoryQuestionsFromApplication[j];

      if (jobQ === appQ.question) {
        console.log(`✔️ Match found:`, appQ);

        foundMatch = true;

        const hasAnswer =
          appQ.answer !== null &&
          appQ.answer !== "" &&
          appQ.answer !== undefined;

        console.log(`   └── Has valid answer:`, hasAnswer);

        if (hasAnswer) {
          result.push(appQ);
        } else {
          result.push({ question: jobQ, answer: null });
        }

        break;
      }
    }

    if (!foundMatch) {
      console.log(
        `❌ No answer found for question "${jobQ}". Setting answer = null`
      );
      result.push({ question: jobQ, answer: null });
    }
  }

  // console.log("❓ [Q_GEN] Final result:", result);
  return result;
};

const now = new Date();

const getLogFileName = (baseName) => {
  const dateStr = now.toISOString().split("T")[0];
  const hrStr = now.getHours().toString()
  const minStr = now.getMinutes().toString()
  const secStr = now.getSeconds().toString()
  return `response/jobApplicationLogs/${baseName}_${dateStr}_${hrStr}_${minStr}_${secStr}.txt`;
};

export async function writeUserFailureMessage({ message }) {
  await fs.appendFile(getLogFileName("failedUserCreationLogs"), `${message}\n`);
}

export async function writeJobFailureMessage({ message }) {
  await fs.appendFile(getLogFileName("failedJobCreationLogs"), `${message}\n`);
}

export async function writeApplicationAlreadyExistFailureMessage({ message }) {
  await fs.appendFile(getLogFileName("failedApplicationLogs"), `${message}\n`);
}

export async function writeApplicationFailureMessage({ message }) {
  await fs.appendFile(getLogFileName("failedApplicationLogs"), `${message}\n`);
}

export async function writeSuccessMessage({ message }) {
  await fs.appendFile(
    getLogFileName("successUserCreationLogs"),
    `${message}\n`
  );
}
