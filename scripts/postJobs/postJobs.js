import jobsRawData from "../../data/testJobList.json" with { type: "json" };
import * as fs from "node:fs/promises";
import { Job } from "./jobClass.js";
import { getAllJobs } from "./getAllJobs.js";

async function postJobs() {
  const url =
    process.env.stage === "preprod"
      ? process.env.CANDIDATE_URL_PROD
      : process.env.CANDIDATE_URL_DEV;
  console.log("api url : ", url);
  console.log("total raw jobs to post : ", jobsRawData.length);
  await fs.mkdir("./response", { recursive: true }).catch((error) => {
    console.log(error);
  });

  //fetching all the jobs temparary solution
  const jobObj = new Job({ baseUrl: url });
  const jobsPool = await getAllJobs({ url });

  const jobPromise = jobsRawData.map(async (rawjob) => {
    try {
      let jobFromDB = null;
      if (rawjob._id) {
        jobFromDB = await jobObj.isJobExist({
          jobsPool,
          jobId: rawjob._id,
        });
      }

      if (jobFromDB !== null) {
        // console.log({jobFromDB})
        const data = await jobObj.formatJob({ jobFromDB, rawData: rawjob });
        // console.log("dta before calling patch: ",data)
        await jobObj.patch({ data });
      } else {
        const data = await jobObj.formatJob({ rawData: rawjob });
        await jobObj.post({ data });
      }
    } catch (error) {
      //   console.error(`Posting Error for ${job.title}:`, error.message);
      //   await writeFailureMessage({ job: job, message: error.message });
      console.log(error);
    }
  });

  await Promise.all(jobPromise);
}

export async function writeFailureMessage({ job, message }) {
  // Check if job exists (for generic catch errors) and log title, otherwise just log message
  const title = job ? job.title : "Unknown Job (Pre-Fetch Error)";
  await fs.writeFile(
    "./response/error.txt",
    `FAILURE: Job Title: ${title}. Error: ${message}\n`,
    { flag: "a" }
  );
}

export async function writeSuccessMessage({ job }) {
  // Assuming result object has the _id property
  await fs.appendFile(
    "./response/success.txt",
    `SUCCESS: ${job.title}, ID: ${job._id}\n`,
    { flag: "a" }
  );
}

await postJobs();
