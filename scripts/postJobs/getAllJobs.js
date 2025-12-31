import { writeFailureMessage } from "./postJobs.js";

export async function getAllJobs({ url }) {
  console.log("starting to fetch all jobs from db");
  try {
    const response = await fetch(`${url}/jobs`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
    const result = await response.json();
    console.log(result);
    console.log("jobpool length : ", result.data.length);
    return result.data;
  } catch (error) {
    console.log(error);
    await writeFailureMessage({
      job: "all jobs fetching",
      message: error.message,
    });
  }
}
