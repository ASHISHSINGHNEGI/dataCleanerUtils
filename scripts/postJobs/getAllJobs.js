import { writeFailureMessage } from "./postJobs.js";

export async function getAllJobs({ url }) {
  try {
    const response = await fetch(`${url}/jobs`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    });
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.log(error);
    await writeFailureMessage({
      job: "all jobs fetching",
      message: error.message,
    });
  }
}
