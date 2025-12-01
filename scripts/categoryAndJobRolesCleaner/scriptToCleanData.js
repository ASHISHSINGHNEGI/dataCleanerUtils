const fs = require("fs");
const path = require("path");

// --- ES6+ Standard Features Used ---
// 1. const/let: Block-scoped variable declaration
// 2. Arrow Functions: Concise function syntax
// 3. Destructuring: Pulling properties from objects/arrays easily
// 4. Spread Operator: Creating new objects/arrays immutably
// 5. Template Literals: String interpolation

// Configuration
const INPUT_FILE = "categories!.json";
const OUTPUT_FILE = "categoriesEdit.json";

/**
 * Generates a relevant set of skills for a job title.
 * @param {string} title The defaultTitleName.
 * @param {string} categoryName The defaultCategoryName.
 * @returns {string[]} An array of generated skills.
 */
const generateSkills = (title) => {
  const skills = new Set();
  if (title.skills && title.skills.length > 0) skills.add(title.skills);
  skills.add(title);
  skills.add("Communication");
  skills.add("Teamwork");
  skills.add("Problem Solving");
  skills.add("Leadership");
  skills.add("Strategic Planning");
  skills.add("Budget Management");
  skills.add("Negotiation");
  skills.add("Client Relations");
  skills.add("Sales Strategy");
  skills.add("Technical Troubleshooting");
  skills.add("Equipment Repair");
  skills.add("System Diagnostics");
  skills.add("Blueprint Reading");
  skills.add("Safety Compliance (HSE)");
  skills.add("Precision Measurement");
  skills.add("Data Entry");
  skills.add("MS Office Proficiency");
  skills.add("Record Keeping");

  // Convert Set back to Array using the spread operator
  return [...skills];
};

/**
 * Converts a single title object to the target structure.
 * It prioritizes existing skills if present.
 * @param {object} titleObj The source title object.
 * @param {string} categoryName The parent category name.
 * @returns {object} The transformed title object.
 */
const processTitle = (titleObj, categoryName) => {
  // Destructuring to extract necessary properties
  const { defaultTitleName, skills } = titleObj;

  const finalSkills = generateSkills(defaultTitleName);

  // Shortened object literal syntax
  return {
    defaultTitleName,
    skills: finalSkills,
  };
};

/**
 * Main function to read, transform, and write the JSON data.
 */
const convertJson = () => {
  try {
    // 1. Read the Input File synchronously
    const filePath = path.join(__dirname, INPUT_FILE);
    const rawData = fs.readFileSync(filePath, "utf8");
    const sourceData = JSON.parse(rawData);

    if (!sourceData.categories || !Array.isArray(sourceData.categories)) {
      throw new Error(
        "Invalid JSON structure: Root object must contain a 'categories' array."
      );
    }

    // 2. Transform Data using map (ES6 array method)
    const transformedData = sourceData.categories.map((category) => {
      // Destructuring category properties
      const { defaultCategoryName, defaultCategoryDesc, titles } = category;

      // Transform titles array
      const transformedTitles = titles.map((title) =>
        processTitle(title, defaultCategoryName)
      );

      // Return new category object in the target structure
      return {
        defaultCategoryName,
        defaultCategoryDesc,
        titles: transformedTitles,
      };
    });

    // 3. Write the Output File synchronously (null, 2 for pretty printing)

    const outPath = path.join(__dirname, OUTPUT_FILE);
    fs.writeFileSync(outPath, JSON.stringify(transformedData, null, 2));

    console.log(`✅ Success! Converted ${INPUT_FILE} to ${OUTPUT_FILE}`);
    console.log(`📂 Saved location: ${outPath}`);
  } catch (error) {
    console.error(`❌ Error processing file: ${error.message}`);
  }
};

// Execute the function
convertJson();
