import { connect } from "../../mongoose/mongoose.js";
import { applyJob } from "./applyJob.js";
import { validateJob, validateUser, writeFailureMessage } from "./helpers.js";




const jobIdList = ["6965ec8f656a21b8ec253cf8", "6965ec8f656a21b8ec253cf9"]
const userIdList = ["694269ba685335a27512ea48", "694269ba685335a27512ea47"];



const main = async ({ jobs, users }) => {
  console.log({
    message: "Started applying on jobs",
    "length of jobs": jobs.length,
    "length of users": users.length,
    number: 1
  });
  await connect()
  for (let i = 0; i < jobs.length; i++) {
    const jobId = jobs[i];
    const job = await validateJob({ jobId })
    console.log({ job })
    if (job === null) {
      await writeFailureMessage({
        message: `Job- ${jobId} Invalid!! `
      })
      console.log(`skipping user application for job id- ${jobId}`)
      continue;
    }
    for (let j = 0; j < users.length; j++) {
      const userId = users[i];
      // Validate user existence
      const user = await validateUser({ userId });
      console.log({ user })
      if (user === null) {
        await writeFailureMessage({
          message: `user- ${userId} not found!! `
        })
        console.log(`skipping user application for user id- ${userId}`)
        continue;
      }
      const isApplied = applyJob({ job, user })
    }
  }

};




main({ jobs: jobIdList, users: userIdList }).then(() => { console.log(" done") }).catch((error) => console.log(error))


