import { connect } from "../../mongoose/mongoose.js";
import { applyJob } from "./applyJob.js";
import { validateJob, validateUser, writeFailureMessage } from "./helpers.js";

const jobIdList = ["6965ec8f656a21b8ec253cf8", "6965ec8f656a21b8ec253cf9"];
const userIdList = ["694269ba685335a27512ea48", "694269ba685335a27512ea47"];

const main = async ({ jobs, users }) => {
  console.log({
    message: "Started applying on jobs",
    "length of jobs": jobs.length,
    "length of users": users.length,
  });
  await connect();
  for (let i = 0; i < jobs.length; i++) {
    const jobId = jobs[i];
    const job = await validateJob({ jobId });

    console.log(`Processing Job ID: ${jobId}`);
    if (job === null) {
      await writeFailureMessage({
        message: `Job- ${jobId} Invalid!! `,
      });
      console.log(`skipping user application for job id- ${jobId}`);
      continue;
    }
    for (let j = 0; j < users.length; j++) {
      const userId = users[j];

      // Validate user existence
      const user = await validateUser({ userId });
      console.log(`  > Processing User ID: ${userId}`);
      if (user === null) {
        await writeFailureMessage({
          message: `user- ${userId} not found!! `,
        });
        console.log(`skipping user application for user id- ${userId}`);
        continue;
      }
      const isApplied = await applyJob({ job, user });
      console.log(
        `  -> Application result: ${isApplied ? "Success" : "Failed"}`
      );
    }
  }
};

main({ jobs: jobIdList, users: userIdList })
  .then(() => {
    console.log(" done");
  })
  .catch((error) => console.log(error));
