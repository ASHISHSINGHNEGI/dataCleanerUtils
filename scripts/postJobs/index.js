const authToken = "eyJraWQiOiJWMmF6Q2NDXC96ajlGZVRBM0FZS0thcU5ZUGdyd1haSGV5NlczbzhkbXVOcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMTUzZmRmYS02MDIxLTcwMzMtMDUzMC0zOGE2ZmI4ZTI2NzAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX01raUVlVUcyMSIsImNsaWVudF9pZCI6IjJjdjRpc2RtZmIzMDdiaWNwMWVqMzg1a3R2Iiwib3JpZ2luX2p0aSI6IjNiNTNiMzRhLTJkNzktNDE4ZS04ZDI3LTJmNGVhZGRmYzcyNSIsImV2ZW50X2lkIjoiNzhlZTYyNDctYjI0YS00MDU4LWE2NjUtMjM5MDY1NWQ3MzlmIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc2NDY4MzMzMSwiZXhwIjoxNzY0NzA0MzQwLCJpYXQiOjE3NjQ3MDA3NDAsImp0aSI6ImEyMzlmOWU1LTlmMmUtNGNjYS05MTM2LTJmNDM2YTExNWJjNiIsInVzZXJuYW1lIjoiMTE1M2ZkZmEtNjAyMS03MDMzLTA1MzAtMzhhNmZiOGUyNjcwIn0.KcfrXIL8cFt2ewDtWNEy_9Z_1oS2aefBTawrmo2_tI1fAgz11M-fbaZKaFKMG76DqBIQeag93AzrUJJ-CEjUp8WKo1e6CxoujSSKkOFfbDU4gMlI_2Gwr36FWsCbUGwZGQ3yn9sKjetsqmvGojpNpPxjiYw7GAclo0PqNkVex9ZPpl_pB81TCUsB8o_PFITrh5AqYFPgqeNqp9-7wSLPPnq5bv-Ze80eY7wegINCHZLu04FrYSWnH3iYDy9-GUN2SVewzZplEDhwU5bfQNlD8iEIwy9YoXJpvAj5L0p9qZRC7Bb_OQx2IBesY5h4diULNbcJWXlScDhWx0azvsjK_A"
import { Types } from "mongoose";
import jobs from "../../data/final_cleanedJobsDataFromSwaraj.json" with { type: "json" };
import * as fs from 'node:fs/promises';

async function postJobs() {
    const url = "https://q01w1i707b.execute-api.ap-south-1.amazonaws.com/preprod/candidate/jobs"
    console.log("total jobs : ", jobs.length);
     await fs.mkdir('./response', { recursive: true }).catch(() => {}); 
        
    const jobPromise = jobs.map(async (job) => {
        try {
            const data = formatTheDataIntoJobSchema(job)
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`
                }
            });
              const result = await response.json();

            if (!response.ok) {
                await writeFailureMessage({
                    job: job,
                    message: `Status: ${response.status}. Body: ${errorBody}`
                });
                return
            }
            const resultData = result.data

             if (!newJobData || !newJobData._id) {
                await writeFailureMessage({
                    job: job,
                    message: `SUCCESS STATUS (2XX) but no ID found in response. Full body: ${JSON.stringify(result)}`
                });
                return;
            }
            console.log("Job posted successfully: ", job.title, " & _id: ", resultData._id);

             await writeSuccessMessage({ job: job, result: newJobData });

        } catch (error) {
            console.error(`Posting Error for ${job.title}:`, error.message);
            await writeFailureMessage({ job: job, message: error.message });
        }
    })

    await Promise.all(jobPromise)
}

const formatTheDataIntoJobSchema = async (data) => {
    // Pre-calculate the ObjectId for clarity and efficiency if needed elsewhere
    console.log("formating the job data")

    if (!data.jobCategory?.id) {
        await writeFailureMessage({ job:data, message: "job category is not present" })
    }
    const categoryId = new Types.ObjectId(data.jobCategory?.id);

    if (!data.userId) {
        await writeFailureMessage({ job:data, message: "userId is not present" })
    }

    const userId = new Types.ObjectId(data.userId);
    console.log("user id : ", userId)
    return {
        ...data,
        // Using optional chaining to safely access nested properties
        userId: userId,
        country: {
            name: data.company?.name,
        },
        jobCategory: {
            name: data.jobCategory?.name,
            id: categoryId
        },
        jobRole: {
            // Note: You are using jobCategory ID here, ensure this is correct for your schema
            "id": categoryId,
            "name": data.jobRole?.name,
        },
        company: {
            name: data.company?.name,
        },
        mandatoryQuestions: [
            "Do you have a passport?",
            "Do you have a resume?"
        ],
        requiredDocuments: [
            {
                name: "resume",
                docId: new Types.ObjectId("692c527c28dc81e767fff278") // Hardcoded ID
            },
        ],
    }
}


async function writeFailureMessage({ job, message }) {
    // Check if job exists (for generic catch errors) and log title, otherwise just log message
    const title = job ? job.title : 'Unknown Job (Pre-Fetch Error)';
    await fs.appendFile('./response/error.txt',
        `FAILURE: Job Title: ${title}. Error: ${message}\n`,
        { flag: 'a' });
}

async function writeSuccessMessage({ job, result }) {
    // Assuming result object has the _id property
    await fs.appendFile('./response/success.txt',
        `SUCCESS: ${job.title}, ID: ${result._id}\n`,
        { flag: 'a' });
}

await postJobs();