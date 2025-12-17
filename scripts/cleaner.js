import fs from "fs";
import path from "path";

const inputPath = path.join(process.cwd(), "data", "lambdaList.text");
const outputPath = path.join(process.cwd(), "data", "result.txt");

try {
  const content = fs.readFileSync(inputPath, "utf8");

  const out = content.replace(/\s+/g, "\n").trim();

  fs.writeFileSync(outputPath, out, "utf8");
  console.log("Wrote output to:", outputPath);
} catch (err) {
  console.error("Error:", err);
}
