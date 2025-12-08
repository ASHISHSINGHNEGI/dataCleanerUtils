import mongoose, { Types } from "mongoose";
import results from "./jobpost1.json" with { type: "json" };
import { currencyConverter } from "../../helpers/currencyConverter.js";
import { CurrencyRates } from "../../mongoose/models/currencyRates.model.js";
import { Jobs } from "../../mongoose/models/jobs.model.js";
import { connect } from "../../mongoose/mongoose.js";

const CANDIDATE_CURRENCY = "INR";



const parseObjectId = (id) => {
  if (id && Types.ObjectId.isValid(id)) return new Types.ObjectId(id);
  return undefined;
};


// Helper to calculate 'dataForCandidate'
const enrichWithCurrency = async (jobData, conversionRate) => {
  if (!conversionRate) return jobData;

  // 1. Salary Conversion
  if (jobData.salary) {
    jobData.salary.dataForCandidate = {
      min: await currencyConverter({
        amount: jobData.salary.min || 0,
        currentCurrencyCode: jobData.salary.currency,
        conversionRate,
      }),
      max: await currencyConverter({
        amount: jobData.salary.max || 0,
        currentCurrencyCode: jobData.salary.currency,
        conversionRate,
      }),
      currency: "INR",
    };

    // Salary Deductions
    if (jobData.salary.deduction) {
      const deductionEntries = Object.entries(jobData.salary.deduction);
      if (deductionEntries.length > 0) {
        const convertedDeductions = await Promise.all(
          deductionEntries.map(async ([key, value]) => {
            return [
              key,
              {
                ...value,
                min: await currencyConverter({
                  amount: value.min || 0,
                  currentCurrencyCode:
                    value.currency || jobData.salary.currency,
                  conversionRate,
                }),
                max: await currencyConverter({
                  amount: value.max || 0,
                  currentCurrencyCode:
                    value.currency || jobData.salary.currency,
                  conversionRate,
                }),
                currency: CANDIDATE_CURRENCY,
              },
            ];
          })
        );
        jobData.salary.deduction.dataForCandidate =
          Object.fromEntries(convertedDeductions);
      }
    }
  }

  // 2. Facilities & Benefits Conversion
  if (jobData.facilitiesAndBenefits) {
    const facilitiesEntries = Object.entries(jobData.facilitiesAndBenefits);
    const convertedFacilities = await Promise.all(
      facilitiesEntries.map(async ([key, value]) => {
        return [
          key,
          {
            ...value,
            amount: await currencyConverter({
              amount: value.amount || 0,
              currentCurrencyCode: value.currency, // Assuming each facility has its own currency field
              conversionRate,
            }),
            currency: CANDIDATE_CURRENCY,
          },
        ];
      })
    );
    jobData.facilitiesAndBenefits.dataForCandidate =
      Object.fromEntries(convertedFacilities);
  }

  // 3. Expenses & Fees Conversion
  if (jobData.expensesAndFees) {
    const expenseEntries = Object.entries(jobData.expensesAndFees);
    const convertedExpenses = await Promise.all(
      expenseEntries.map(async ([key, value]) => {
        return [
          key,
          {
            ...value,
            amount: await currencyConverter({
              amount: value.amount || 0,
              currentCurrencyCode: value.currency,
              conversionRate,
            }),
            currency: CANDIDATE_CURRENCY,
          },
        ];
      })
    );
    jobData.expensesAndFees.dataForCandidate =
      Object.fromEntries(convertedExpenses);
  }

  return jobData;
};

const mapRowToJobData = (row) => {
  return {
    userId: new mongoose.Types.ObjectId(row.userId),
    title: row.title,
    description: row.description,
    responsibilities: row.responsibilities,
    type: "FULL-TIME",
    contractPeriod: row.contractPeriod,
    contractRenewalPolicy: row.contractRenewalPolicy,

    location: {
      city: row.location__city,
      state: row.location__state,
      country: row.location__country,
      remote: row.location__remote,
    },
    status: row.status || "UNDER_REVIEW",
    salary: {
      min: Number(row.salary__min) || 0,
      max: Number(row.salary__max) || 0,
      currency: row.salary__currency,
      frequency: row.salary__frequency,
      deduction: {},
    },
    workingConditions: {
      dutyHoursPerDay: Number(row.workingConditions__dutyHoursPerDay||10),
      workingDaysPerMonth: Number(row.workingConditions__workingDaysPerMonth||30),
      breakTimeIncluded: row.workingConditions__breakTimeIncluded|| false,
      leaveBenefits: row.workingConditions__leaveBenefits
        ? [row.workingConditions__leaveBenefits]
        : [],
    },
    candidateRequirements: {
      gender:"any",
        // row.candidateRequirements__gender === "NO_PREFERENCE"
        //   ? "Any"
        //   : row.candidateRequirements__gender,
      ageLimit: {
        min: Number(row.candidateRequirements__ageLimit__min||0),
        max: Number(row.candidateRequirements__ageLimit__max||0),
      },
      education: row.candidateRequirements__education__degree
        ? [
            {
              degree: row.candidateRequirements__education__degree,
              fieldOfStudy: row.candidateRequirements__education__fieldOfStudy,
              grade: row.candidateRequirements__education__grade,
            },
          ]
        : [],
      experience: {
        minimumYears: Number(
          row.candidateRequirements__experience__minimumYears||0
        ),
        description: row.candidateRequirements__experience__description
          ? [row.candidateRequirements__experience__description]
          : [],
      },
      skills: row.candidateRequirements__skills
        ? row.candidateRequirements__skills.split(",").map((s) => s.trim())
        : [],
    },
    facilitiesAndBenefits: {
      food: {
        status: row["food_facilitiesAndBenefits__|__status"],
        deductible: 
          row["food_facilitiesAndBenefits__|__deductible"]
        ,
        amount: Number(row["food_facilitiesAndBenefits__|__amount"]) || 0,
        currency: row["food_facilitiesAndBenefits__|__currency"],
      },
      accommodation: {
        status: 
          row["accomodation_facilitiesAndBenefits__|__status"]
        ,
        deductible: 
          row["accomodation_facilitiesAndBenefits__|__deductible"]
        ,
        amount:
          Number(row["accomodation_facilitiesAndBenefits__|__amount"]) || 0,
        currency: row["accomodation_facilitiesAndBenefits__|__currency"],
      },
      medical_insurance: {
        status: 
          row["medical_insurance_facilitiesAndBenefits__|__status"]
        ,
        deductible: 
          row["medical_insurance_facilitiesAndBenefits__|__deductible"]
        ,
        amount:
          Number(row["medical_insurance_facilitiesAndBenefits__|__amount"]) ||
          0,
        currency: row["medical_insurance_facilitiesAndBenefits__|__currency"],
      },
      visa: {
        status: row["visa_facilitiesAndBenefits__|__status"],
        deductible: 
          row["visa_facilitiesAndBenefits__|__deductible"]
        ,
        amount: Number(row["visa_facilitiesAndBenefits__|__amount"]) || 0,
        currency: row["visa_facilitiesAndBenefits__|__currency"],
      },
    },
    expensesAndFees: {
      approxExpenses: {
        status: row["approxExpenses_expensesAndFees__|__status"],
        amount: Number(row["approxExpenses_expensesAndFees__|__amount"]||0),
        currency: row["approxExpenses_expensesAndFees__|__currency"],
      },
    },
    company: { name: row.company__name, id: parseObjectId(row.company__id) },
    jobRole: { name: row.jobRole__name, id: parseObjectId(row.jobRole__id) },
    jobCategory: {
      name: row.jobCategory__name,
      id: parseObjectId(row.jobCategory__id),
    },
    isActive: row.isActive ?? false,
    dateOfApplication: row.dateOfApplication
      ? new Date(row.dateOfApplication)
      : new Date(),
    dateOfExpiration: row.dateOfExpiration
      ? new Date(row.dateOfExpiration)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isFeatured: row.isFeatured ?? false,
    positions: Number(row.positions) || 1,
    mode_of_apply: row.mode_of_apply || "Portal",
    mandatoryQuestions: row.mandatoryQuestions ? [row.mandatoryQuestions] : [],
    requiredDocuments: row.requiredDocuments__name
      ? [
          {
            name: row.requiredDocuments__name,
            docId: row.requiredDocuments__docId,
            description: row.requiredDocuments__description,
          },
        ]
      : [],
  };
};

const processCSV = async () => {
  await connect();

  // 1. Fetch Conversion Rates
  console.log("💱 Fetching Currency Rates...");
  const rateDoc = await CurrencyRates.findOne({}, { conversion_rates: 1 });
  let conversionRate = rateDoc?.conversion_rates;

  if (!conversionRate) {
    console.warn(
      "⚠️  WARNING: No Conversion Rates found in DB. 'dataForCandidate' will not be calculated."
    );
    // Optional: Add fallback logic here or throw error if strictly required
  } else {
    console.log("✅ Conversion Rates loaded.");
  }

  const filePath = "scripts/postJobs/jobpost.csv";

  console.log(`📂 Reading CSV from ${filePath}...`);

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on("data", (data) => results.push(data))
//     .on("end", async () => {
//       console.log(`📊 Found ${results.length} rows.`);

      const successList = [];
      const failureList = [];

      for (let i = 0; i < results.length; i++) {
        const row = results[i];
        const rowNum = i + 2; // +1 for 0-index, +1 for header row

        try {
          // 1. Validation Pre-Check
          if (!row.title || !row.userId) {
            throw new Error("Missing Title or UserId");
          }

          // 2. Map & Enrich
          let jobData = mapRowToJobData(row);
          if (conversionRate) {
            jobData = await enrichWithCurrency(jobData, conversionRate);
          }

          // 3. Save
          const savedJob = await Jobs.create(jobData);

          // 4. Log Success
          successList.push({
            row: rowNum,
            title: jobData.title,
            jobId: savedJob._id,
            status: "CREATED",
          });
          process.stdout.write("✅");
        } catch (err) {
          // 5. Log Failure
          failureList.push({
            row: rowNum,
            title: row.title || "Unknown",
            error: err.message,
            status: "FAILED",
          });
          process.stdout.write("❌");
        }
      }

      // --- GENERATE REPORT ---
      const finalReport = {
        timestamp: new Date().toISOString(),
        summary: {
          totalRows: results.length,
          successful: successList.length,
          failed: failureList.length,
        },
        failures: failureList,
        successes: successList,
      };


      console.log(`\n\n==============================`);
      console.log(`       IMPORT SUMMARY`);
      console.log(`==============================`);
      console.log(`Total Processed : ${results.length}`);
      console.log(`✅ Success      : ${successList.length}`);
      console.log(`❌ Failed       : ${failureList.length}`);
      
      if (failureList.length > 0) {
        console.log(`\n⚠️ First 3 Failures:`);
        failureList
          .slice(0, 3)
          .forEach((f) => console.log(`   Row ${f.row}: ${f.error}`));
      }

      process.exit();

};

processCSV().catch((err) => console.error(err));
