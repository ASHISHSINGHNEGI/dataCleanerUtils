const authToken = "eyJraWQiOiJtelladG1yeTZFaGhPTHNDV3ZlRGdBNWZCbXZ1WENDVDBVNFZGOGVoRkI4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJlMWMzNmQ5YS1kMGExLTcwNzQtMzllOS1lNzYzMTU5N2EwYWMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xXzcyV3VQbTZHNSIsImNsaWVudF9pZCI6IjQxaTBlbGllN2lwdmUyM3JvMmNnbGRjbG4xIiwib3JpZ2luX2p0aSI6IjlmYTdhYmE3LTRmOTAtNDFiZS05MGFmLWUzMWQxOGQ2YmQ1YiIsImV2ZW50X2lkIjoiZTkyMGZmMTUtNDY2ZC00OThkLWJiMDktMDdjNmI5MmVlNTIzIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc2NDc2MzU1OSwiZXhwIjoxNzY0NzcxMzc4LCJpYXQiOjE3NjQ3Njc3NzgsImp0aSI6IjA4ZDM3ZTExLWNjYTctNDY0NC1iNGJhLTk2YWRlZDhjNjkxNyIsInVzZXJuYW1lIjoiZTFjMzZkOWEtZDBhMS03MDc0LTM5ZTktZTc2MzE1OTdhMGFjIn0.ttRffzi4TZuNA9tsUawYdMKnDuad-6gVgpm0f9BD7uSGPn4IANEghbFmE0AFSh4eAClIZQ783JaPrWthl-nIxn3EqR1g-2lYFKw0E3Mum-otsll5dnBsGIuR2jrpZ3ssQo5qCnaNCW1bExDaKWwLq6dtqnLRwc3Xw0RSrJxc54Gmq352Nfe9KzIBNXYUNPzQIYvulwrO0hhf998kKPg34FT1KvYVAZqBbE8fZ908g1uRsnYUNExIXvRDEgFaOi0YRBJDkXk1mETbvoe9HAmxdYSD47xuI233Xdm-iLQPx_Bu5aeJClvmn5afQ0FgU_CJ_asDdWXyboaUHIL_9vBRRA"
const authToken_prod = "eyJraWQiOiJWMmF6Q2NDXC96ajlGZVRBM0FZS0thcU5ZUGdyd1haSGV5NlczbzhkbXVOcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMTUzZmRmYS02MDIxLTcwMzMtMDUzMC0zOGE2ZmI4ZTI2NzAiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX01raUVlVUcyMSIsImNsaWVudF9pZCI6IjJjdjRpc2RtZmIzMDdiaWNwMWVqMzg1a3R2Iiwib3JpZ2luX2p0aSI6Ijg1OWYzM2ExLTQwMjMtNDhjZC04ZTU2LTZiMTM3YzI1Yzk1YyIsImV2ZW50X2lkIjoiMTMyNjRhMTMtMDUwMS00ZjdkLTlhNzYtMTMzN2U5MTFhZjk2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc2NDc1Njg3OCwiZXhwIjoxNzY0NzY0MTM3LCJpYXQiOjE3NjQ3NjA1MzcsImp0aSI6IjljZGNiOWU4LTBlZjEtNGEzMS04ZTc2LWYzYWM0MjQzZjM3YSIsInVzZXJuYW1lIjoiMTE1M2ZkZmEtNjAyMS03MDMzLTA1MzAtMzhhNmZiOGUyNjcwIn0.kyXqEC81XdMFooLFAoRmImHUX2Nsgs3gcpOiiGdjDwxqzSreDGjDgs4qrahnvPsG_X8W5EtmLG-8om57qEkAtLRENdtriWCE4Y7DSZMu8Sl-57iog3CIGHpEFTp5DdGCf1oKCD9y0JSWhJYBgPojPequ2HT-vQ5n8jstPIzWBA32mq1RVaedFvtRY_dZUSllIRN1oV0ImEDC1OHSMXVFx3dVY-V36OorYhJhHaC_d-3Z43-P-afqsK6X1jn0yBF_n9xDmcbKUjRjnZnTlrJmmswixafIRrKkhb-CnfQaNP-9gdeFV5ZF82CBenF_ZbvNdqw099nVAeb3nHmcyDaT0A"
import { Types } from "mongoose";
import jobs from "../../data/errorLIst.json" with { type: "json" };
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
            const response = await fetch(url_dev, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${authToken}`
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

    // Convert to ObjectId synchronously
    const categoryId = new Types.ObjectId(data.jobCategory.id);
    const userId = new Types.ObjectId(data.userId);

    // Define safe, empty default objects for deduction fields
    // const deduction = data.salary?.deduction;
    // const accommodationAllowance = deduction?.accommodationAllowance;
    // const medicalInsurance = deduction?.medicalInsurance;

    // // Define safe, empty default objects for candidate requirements fields
    // const candidateReqs = data.candidateRequirements;
    // const ageLimit = candidateReqs?.ageLimit;
    // const educationArr = candidateReqs?.education;
    // const experienceObj = candidateReqs?.experience;
    // const languagesArr = candidateReqs?.languages;


    // const facilitiesAndBenefits = data?.facilitiesAndBenefits;

    return {
        ...data,
        userId: userId,
        // title: data.title || "",
        // description: data.description || "",
        // responsibilities: data.responsibilities || "",
        // type: data.type || "FULL-TIME",
        // contractPeriod: data.contractPeriod || "",
        // contractRenewalPolicy: data.contractRenewalPolicy || "",
        // location: {
        //     city: data.location.city || "",
        //     state: data.location.state || "",
        //     country: data.location.country || "",
        //     remote: data.location.remote || false,
        // },
        // status: "PUBLISHED",
        // salary: {
        //     min: data.salary?.min ?? 0,
        //     max: data.salary?.max ?? 0,
        //     currency: data.salary?.currency || "INR",
        //     frequency: data.salary?.frequency || "Monthly",

        //     // FIX 2: Safely access deeply nested deduction properties (Handles jobs 16-99)
        //     deduction: {
        //         accommodationAllowance: {
        //             // Use ?. to safely check the existence of accommodationAllowance
        //             min: accommodationAllowance?.min ?? 0,
        //             max: accommodationAllowance?.max ?? 0,
        //             currency: accommodationAllowance?.currency || "INR",
        //         },
        //         medicalInsurance: {
        //             // Use ?. to safely check the existence of medicalInsurance
        //             min: medicalInsurance?.min ?? 0,
        //             max: medicalInsurance?.max ?? 0,
        //             currency: medicalInsurance?.currency || "INR",
        //         },
        //     },
        // },

        // // FIX 3: Safely access workingConditions properties
        // workingConditions: {
        //     // Use ?? 0 for numbers, || [] for arrays
        //     dutyHoursPerDay: data.workingConditions?.dutyHoursPerDay ?? 0,
        //     workingDaysPerMonth: data.workingConditions?.workingDaysPerMonth ?? 0,
        //     breakTimeIncluded: data.workingConditions?.breakTimeIncluded ?? false, // Changed from || 0 to ?? false (better default)
        //     leaveBenefits: data.workingConditions?.leaveBenefits || [],
        // },

        // // FIX 4: Safely access candidateRequirements properties
        // candidateRequirements: {
        //     gender: candidateReqs?.gender || "any",
        //     ageLimit: {
        //         min: ageLimit?.min ?? 0,
        //         max: ageLimit?.max ?? 0,
        //     },
        //     education: educationArr && educationArr.length > 0 ? educationArr : [],
        //     experience: {
        //         minimumYears: experienceObj?.minimumYears ?? 0,
        //         description: experienceObj?.description || [],
        //     },
        //     skills: candidateReqs?.skills || [],
        //     languages: languagesArr && languagesArr.length > 0 ? languagesArr : [],
        // },
        // facilitiesAndBenefits: {
        //     food: {
        //         status: facilitiesAndBenefits?.food?.status || false,
        //         deductible: facilitiesAndBenefits?.food?.deductible || false,
        //         amount: facilitiesAndBenefits?.food?.amount || 0,
        //         currency: facilitiesAndBenefits?.food?.currency || "INR",
        //     },
        //     accommodation: {
        //         status: facilitiesAndBenefits?.accommodation?.status || false,
        //         deductible: facilitiesAndBenefits?.accommodation?.deductible || false,
        //         amount: facilitiesAndBenefits?.accommodation?.amount || 0,
        //         currency: facilitiesAndBenefits?.accommodation?.currency || "INR",
        //     },
        //     medical_insurance: {
        //         status: facilitiesAndBenefits?.medical_insurance?.status || false,
        //         deductible: facilitiesAndBenefits?.medical_insurance?.deductible || false,
        //         amount: facilitiesAndBenefits?.medical_insurance?.amount || 0,
        //         currency: facilitiesAndBenefits?.medical_insurance?.currency || "INR",
        //     },
        //     travel: {
        //         status: facilitiesAndBenefits?.travel?.status || false,
        //         deductible: facilitiesAndBenefits?.travel?.deductible || false,
        //         amount: facilitiesAndBenefits?.travel?.amount || 0,
        //         currency: facilitiesAndBenefits?.travel?.currency || "INR",
        //     },
        //     visa: {
        //         status: facilitiesAndBenefits?.visa?.status || false,
        //         deductible: facilitiesAndBenefits?.visa?.deductible || false,
        //         amount: facilitiesAndBenefits?.visa?.amount || 0,
        //         currency: facilitiesAndBenefits?.visa?.currency || "INR",
        //     },
        //     passport: {
        //         status: facilitiesAndBenefits?.passport?.status || false,
        //         deductible: facilitiesAndBenefits?.passport?.deductible || false,
        //         amount: facilitiesAndBenefits?.passport?.amount || 0,
        //         currency: facilitiesAndBenefits?.passport?.currency || "INR",
        //     },

        // },
        // expensesAndFees: {
        //     approxExpenses: {
        //         status: data.expensesAndFees?.approxExpenses?.status || false,
        //         amount: data.expensesAndFees?.approxExpenses?.amount || 0,
        //         currency: data.expensesAndFees?.approxExpenses?.currency || "INR",
        //     },
        //     registrationProcessingFee: {
        //         status: data.expensesAndFees?.registrationProcessingFee?.status || false,
        //         amount: data.expensesAndFees?.registrationProcessingFee?.amount || 0,
        //         currency: data.expensesAndFees?.registrationProcessingFee?.currency || "INR",
        //     },
        //     registrationProcessingFeeGst: {
        //         status: data.expensesAndFees?.registrationProcessingFeeGst?.status || false,
        //         amount: data.expensesAndFees?.registrationProcessingFeeGst?.amount || 0,
        //         currency: data.expensesAndFees?.registrationProcessingFeeGst?.currency || "INR",
        //     },
        // },
        // selectionProcess: data.selectionProcess || [],
        // country: {
        //     name: data.company?.name,
        // },
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