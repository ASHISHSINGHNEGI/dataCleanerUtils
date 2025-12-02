import categoryDatas from "../data/categoriesEdit.json" with { type: "json" };
import { JobCategory } from "../mongoose/models/jobCategory.model.js";
import { JobRoles } from "../mongoose/models/jobroles.model.js";
import { connect } from "../mongoose/mongoose.js";
async function populateJobCategory() {
  try {
    await connect();
    console.log({
      message: "data length",
      data: categoryDatas.length,
    });
    await Promise.all(
      categoryDatas.map(async (category) => {
        console.log({
          message: " checking  for existing category data",
          data: category.defaultCategoryName,
        });

        let categoryDataInDb = await JobCategory.findOne({
          name: category.defaultCategoryName,
        }).lean();

        if (categoryDataInDb) {
          console.log({
            message: "Category data already present in db",
            data: categoryDataInDb,
          });
        } else {
          const data = {
            name: category.defaultCategoryName,
            description: category.defaultCategoryDesc,
          };
          console.log({
            message: "category data for posting",
            data,
          });
          categoryDataInDb = await JobCategory.create(data);
          console.log({
            message: "category post successful",
            data: categoryDataInDb,
          });
        }
        const jobRolePromises = category.titles.map(async (jobRole) => {
          return postJobRole({
            data: jobRole,
            JobCategoryId: categoryDataInDb._id,
          });
        });
        await Promise.all(jobRolePromises);
      })
    );
    console.log("All categories and job roles processed successfully.");
  } catch (error) {
    console.error({
      message: "Internal server error during data population",
      error: error.message,
      stack: error.stack,
    });
  }
}

const postJobRole = async ({ data, JobCategoryId }) => {
  console.log({
    message: "Job role posting starting",
    data: data.defaultTitleName,
  });
  const rawData = {
    title: data.defaultTitleName,
    jobCategory: JobCategoryId,
    skills: data.skills,
  };
  console.log({
    message: "job role data for posting",
    data: rawData,
  });
  const existingData = await JobRoles.findOne({
    title: data.defaultTitleName,
  });
  if (existingData) {
    console.log({
      message: "jobrole data already present in db",
      data: existingData.title,
    });
    return existingData;
  }
  try {
    const result = await JobRoles.create(rawData);
    console.log({
      message: "post successful",
      data: result.title,
    });
    return result;
  } catch (error) {
    console.error(`Error creating job role: ${rawData.title}`, error);
    throw error;
  }
};

await populateJobCategory();
