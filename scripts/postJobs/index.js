const authToken = process.env.ACCESS_TOKEN;
import { Types } from "mongoose";
import jobs from "../../data/final_cleaned.json" with { type: "json" };
import * as fs from "node:fs/promises";

async function postJobs() {
  const url = process.env.stage==="preprod"
    ? process.env.CANDIDATE_URL_PROD
    : process.env.CANDIDATE_URL_DEV;
  console.log("api url : ", url);
  console.log("total jobs : ", jobs.length);
  await fs.mkdir("./response", { recursive: true }).catch((error) => {
    console.log(error);
  });

  const jobPromise = jobs.map(async (job) => {
    try {
      const data = formatTheDataIntoJobSchema(job);
      // console.log(data)
      const response = await fetch(url_prod, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const result = await response.json();

      if (!response.ok) {
        console.error(`${response.statusText}, ${response.status}`);
        await writeFailureMessage({
          job: job,
          message: `Status: ${response.status}. , ${response.statusText}`,
        });
        return;
      }
      const resultData = result.data;
      console.log(
        "Job posted successfully: ",
        job.title,
        " & _id: ",
        resultData._id
      );
      await writeSuccessMessage({ job: job, result: resultData });
    } catch (error) {
      console.error(`Posting Error for ${job.title}:`, error.message);
      await writeFailureMessage({ job: job, message: error.message });
    }
  });

  await Promise.all(jobPromise);
}

const formatTheDataIntoJobSchema = (data) => {
  // Pre-calculate the ObjectId for clarity and efficiency if needed elsewhere
  console.log("formating the job data");

  if (!data.jobCategory?.id) {
    throw new Error("Job category ID is missing.");
  }
  if (!data.userId) {
    throw new Error("User ID is missing.");
  }
  if (!data.jobRole?.id) {
    throw new Error("Job role ID is missing.");
  }

  // Convert to ObjectId synchronously
  const categoryId = new Types.ObjectId(data.jobCategory.id);
  const userId = new Types.ObjectId(data.userId);
  const jobRoleId = new Types.ObjectId(data.jobRole.id);

  return {
    ...data,
    userId: userId,

    jobCategory: {
      name: data.jobCategory?.name,
      id: categoryId,
    },
    jobRole: {
      id: jobRoleId,
      name: data.jobRole?.name,
    },
    company: {
      name: data.company?.name,
    },
    mandatoryQuestions: ["Do you have a passport?", "Do you have a resume?"],
    requiredDocuments: [
      {
        name: "resume",
        docId: new Types.ObjectId("692c527c28dc81e767fff278"), // Hardcoded ID
      },
    ],
  };
};

export async function writeFailureMessage({ job, message }) {
  // Check if job exists (for generic catch errors) and log title, otherwise just log message
  const title = job ? job.title : "Unknown Job (Pre-Fetch Error)";
  await fs.appendFile(
    "./response/error.txt",
    `FAILURE: Job Title: ${title}. Error: ${message}\n`,
    { flag: "a" }
  );
}

async function writeSuccessMessage({ job, result }) {
  // Assuming result object has the _id property
  await fs.appendFile(
    "./response/success.txt",
    `SUCCESS: ${job.title}, ID: ${result._id}\n`,
    { flag: "a" }
  );
}

await postJobs();
