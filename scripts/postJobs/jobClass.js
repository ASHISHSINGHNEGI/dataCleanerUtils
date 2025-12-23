import { Types } from "mongoose";
import { writeFailureMessage, writeSuccessMessage } from "./postJobs.js";

export class Job {
  constructor({ baseUrl }) {
    this.url = baseUrl;
  }
  createJob(job) {
    console.log("creating a new jobs");
  }
  updateJob({ jobId }) {
    console.log("creating a new jobs");
  }

  async isJobExist({ jobPool = null, jobId }) {
    console.log("Checking the job existencse : ", jobId);
    let jobData = jobPool;
    if (jobPool === null) {
      try {
        const response = await fetch(`${this.url}/jobs`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          },
        });
        const result = await response.json();
        jobData = result.data;
      } catch (error) {
        console.log(error);
        await writeFailureMessage({
          job: "Error while fetching single job",
          message: error.message,
        });
      }
    }
    console.log({ "getJobData length": jobData.length });
    const indexOfreqJob = await jobData.findIndex(
      (job) => jobId === job._id.toString()
    );

    if (indexOfreqJob !== -1) {
      console.log("job found with _id: ", jobData[indexOfreqJob]._id);
      return jobData[indexOfreqJob];
    }
    console.log("job Not found with _id: ", jobId);
    return null;
  }

  async formatJob({ rawData, jobFromDB }) {
    // Pre-calculate the ObjectId for clarity and efficiency if needed elsewhere
    // console.log({
    //   rawData,
    //   jobFromDB: JSON.stringify(jobFromDB, null, 2),
    // });
    const data = rawData;
    console.log("formating the job data");
    // Convert to ObjectId synchronously
    // const userIdFromRawData = data.userId;
    // const userIdFromJobFromDb = jobFromDB.userId;
    // console.log({
    //   userIdFromRawData,
    //   "type of userIdFromRawData: ": typeof userIdFromRawData,
    //   userIdFromJobFromDb,
    //   "type of userIdFromJobFromDb: ": typeof userIdFromJobFromDb,
    // });

    //************************************ */
    const userId = data.userId
      ? this.convertToMongoObjId(data.userId)
      : this.convertToMongoObjId(jobFromDB.userId);
    //********************************** */
    let jobCategory;
    if (data.jobCategory) {
      jobCategory = {
        id: this.convertToMongoObjId(data.jobCategory.id),
        name: data.jobCategory.name,
      };
    } else if (jobFromDB.jobCategory) {
      jobCategory = {
        id: this.convertToMongoObjId(jobFromDB.jobCategory.id),
        name: jobFromDB.jobCategory.name,
      };
    } else {
      console.log(
        `jobCatetory details are not found anywhere for ${jobFromDB._id}`
      );
      await writeFailureMessage({
        message: `jobCatetory details are not found anywhere`,
        job: jobFromDB._id,
      });
    }
    //******************************************* */
    let jobRole;
    if (data.jobRole) {
      jobRole = {
        id: this.convertToMongoObjId(data.jobRole.id),
        name: data.jobRole.name,
      };
    } else if (jobFromDB.jobRole) {
      jobRole = {
        id: this.convertToMongoObjId(jobFromDB.jobRole.id),
        name: jobFromDB.jobRole.name,
      };
    } else {
      console.log(
        `jobRole details are not found anywhere for ${jobFromDB._id}`
      );
      await writeFailureMessage({
        message: `jobRole details are not found anywhere`,
        job: jobFromDB._id,
      });
    }
    //************************************************** */
    // console.log({ "type of user Id": typeof userId });
    const formattedJob = {
      ...data,
      userId,
      jobCategory,
      jobRole,
      // company: {
      //   name: data.company?.name,
      // },
      mandatoryQuestions: ["Do you have a passport?", "Do you have a resume?"],
      requiredDocuments: [
        {
          name: "resume",
          docId: new Types.ObjectId("692c527c28dc81e767fff278"), // Hardcoded ID
        },
      ],
    };
    // console.log({ formattedJob });
    console.log("formattting successful for job id");
    return formattedJob;
  }

  convertToMongoObjId(id) {
    if (!id) {
      throw new Error("Invalid Id while calling returnMongooseObjectId");
    }
    return typeof id === "string" ? new Types.ObjectId(id) : id;
  }

  async post({ data }) {
    const response = await fetch(`${this.url}/candidate/jobs`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
    // console.log({ response });
    const result = await response.json();
    // console.log({ result });

    if (!response.ok) {
      console.error(`${response.statusText}, ${response.status}`);
      await writeFailureMessage({
        job: data,
        message: `Post Status: failed for job ${data.title}`,
      });
      return;
    }
    const resultData = result.data;
    console.log(
      "Job posted successfully: ",
      resultData.title,
      " & _id: ",
      resultData._id
    );
    await writeSuccessMessage({ job: resultData });
  }

  async patch({ data }) {
    const { _id, ...rest } = data;
    // console.log({
    //   _id,
    //   rest,
    // });
    try {
      const response = await fetch(`${this.url}/candidate/jobs/${_id}`, {
        method: "PATCH",
        body: JSON.stringify(rest),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        },
      });
      // console.log({ response });

      if (!response.ok) {
        console.error(`${response.statusText}, ${response.status}`);
        await writeFailureMessage({
          job: data,
          message: `Patch Status: failed for job ${rest.title}`,
        });
        return;
      }
      const result = await response.json();
      const resultData = result.job;
      console.log({ resultData });
      console.log(result.message, " & _id: ", resultData._id);
      await writeSuccessMessage({ job: resultData });
    } catch (error) {
      console.log("error while patch job details");
      console.log(error);
    }
  }
}
