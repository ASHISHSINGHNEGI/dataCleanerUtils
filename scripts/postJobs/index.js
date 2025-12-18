const authToken = "eyJraWQiOwith { type: "json" };iJtelladG1yeTZFaGhPTHNDV3ZlRGdBNWZCbXZ1WENDVDBVNFZGOGVoRkI4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlMWMzNmQ5YS1kMGExLTcwNzQtMzllOS1lNzYzMTU5N2EwYWMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xXzcyV3VQbTZHNSIsImNsaWVudF9pZCI6IjQxaTBlbGllN2lwdmUyM3JvMmNnbGRjbG4xIiwib3JpZ2luX2p0aSI6IjlmYTdhYmE3LTRmOTAtNDFiZS05MGFmLWUzMWQxOGQ2YmQ1YiIsImV2ZW50X2lkIjoiZTkyMGZmMTUtNDY2ZC00OThkLWJiMDktMDdjNmI5MmVlNTIzIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc2NDc2MzU1OSwiZXhwIjoxNzY0Nzc1NDYyLCJpYXQiOjE3NjQ3NzE4NjIsImp0aSI6ImRlYjY2MzY2LTk4NDMtNGZjOC05YTU2LTJiMGMwYWI3OGUxYiIsInVzZXJuYW1lIjoiZTFjMzZkOWEtZDBhMS03MDc0LTM5ZTktZTc2MzE1OTdhMGFjIn0.yry7ITHIZJUfsxqqQBHkiy5_uHBTq5xa5-9u7KNzeonFddu_RVLOFqd7bQFSuP20CdScesJKww_EnuI-zch2UlErY2QSsAjIpp2Ds0v8eXLyxj67SsaW0nuRrBoqaRoM15dgUQ05v5VW1Kfg62spn2s9biklLuIDhD9kkdrUkgC4yV1vo4csGsMXqUS7emqo_a_dpFbcoa5QNBJBkYEosdFv37Q3594LbMI_gJgCJuXwc-CwjEEhmtWdlAKxtLPA6sMqpeuh_QOMOaxoymfhw03cxJwFGLgAbC7_J-6A7qnu_47MjkuXPaqjK3eyOiMYvAGDjadNptMPBsk7h10jCw"
const authToken_prod = "eyJraWQiOiJWMmF6Q2NDXC96ajlGZVRBM0FZS0thcU5ZUGdyd1haSGV5NlczbzhkbXVOcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMTUzZmRmYS02MDIxLTcwMzMtMDUzMC0zOGE2ZmI4ZTI2NzAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX01raUVlVUcyMSIsImNsaWVudF9pZCI6IjJjdjRpc2RtZmIzMDdiaWNwMWVqMzg1a3R2Iiwib3JpZ2luX2p0aSI6Ijg1OWYzM2ExLTQwMjMtNDhjZC04ZTU2LTZiMTM3YzI1Yzk1YyIsImV2ZW50X2lkIjoiMTMyNjRhMTMtMDUwMS00ZjdkLTlhNzYtMTMzN2U5MTFhZjk2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc2NDc1Njg3OCwiZXhwIjoxNzY0Nzc2NDM4LCJpYXQiOjE3NjQ3NzI4MzgsImp0aSI6ImY2YTJiN2Y0LTRlZjEtNGQ2OS1hZjYzLTUwMWQxYzZmZWNhMyIsInVzZXJuYW1lIjoiMTE1M2ZkZmEtNjAyMS03MDMzLTA1MzAtMzhhNmZiOGUyNjcwIn0.Wj5vAri4t5roe0ASiXxFo9USkvdyp6HQWNG_8kHPxKhjvO4WLwK0eGdKQgBFBB0ILWHB-V7dLEiIg25QXkk6veOSM77ODzGcyEt0ja5upEpSRs3IiBy6CWGRmA73t2Wh5SkrthIwpxt6vyJxBcaAe9MGO9l4lB4CNts1ezvW0SASIxke0SiU4XfGQAtiVQwAhr9UA28h_mBG2XuOf_9Di2oovo_wYaMKVteYhza7-jMwKS6G0BAyj2QCupk6ty_9-jS1OQUi6lEFw4_d8vGh2gidqFRSKNfAYz-09oYYm2DkAKwA_u_mnpKHzTHE3vknvT1-bafyLqB4-ItBEHSoVA"
import { Types } from "mongoose";
import jobs from "../../data/final_cleaned.json" with { type: "json" };
import * as fs from 'node:fs/promises';

async function postJobs() {
    const url_prod = "https://q01w1i707b.execute-api.ap-south-1.amazonaws.com/preprod/candidate/jobs" //prod
    const url_dev = "https://zj5sfb8b82.execute-api.ap-south-1.amazonaws.com/dev/candidate/jobs"
    console.log("total jobs : ", jobs.length);
    await fs.mkdir('./response', { recursive: true }).catch((error) => { console.log(error) });

    const jobPromise = jobs.map(async (job) => {
        try {
            const data = formatTheDataIntoJobSchema(job)
            // console.log(data)
            const response = await fetch(url_prod, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken_prod}`
                }
            });
            const result = await response.json();

            if (!response.ok) {
                console.error(`${response.statusText}, ${response.status}`)
                await writeFailureMessage({
                    job: job,
                    message: `Status: ${response.status}. , ${response.statusText}`
                });
                return
            }
            const resultData = result.data
            console.log("Job posted successfully: ", job.title, " & _id: ", resultData._id);
            await writeSuccessMessage({ job: job, result: resultData });

        } catch (error) {
            console.error(`Posting Error for ${job.title}:`, error.message);
            await writeFailureMessage({ job: job, message: error.message });
        }
    })

    await Promise.all(jobPromise)
}

const formatTheDataIntoJobSchema = (data) => {
    // Pre-calculate the ObjectId for clarity and efficiency if needed elsewhere
    console.log("formating the job data")

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
            id: categoryId
        },
        jobRole: {
            "id": jobRoleId,
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


export async function writeFailureMessage({ job, message }) {
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