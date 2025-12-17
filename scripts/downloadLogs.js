import fs from "fs";
import path from "path";
import { LambdaClient, GetFunctionCommand } from "@aws-sdk/client-lambda";
import https from "https";
import {
  CloudWatchLogsClient,
  ListAnomaliesCommand,
} from "@aws-sdk/client-cloudwatch-logs";
const REGION = "ap-south-1";
// ---------- CONFIG ---------- //
const FUNCTION_NAME = "kovon-nurse-candidate-dev-getUser"; // change this
// const OUTPUT_FILE = path.join(process.cwd(), `${FUNCTION_NAME}.zip`);

const lambda = new LambdaClient({
  region: "ap-south-1", // change if needed
});

// ---------- MAIN LOGIC ---------- //
async function downloadLambda(functionName, outputPath) {
  try {
    console.log(`Fetching Lambda function details: ${functionName}`);

    const command = new GetFunctionCommand({ FunctionName: functionName });
    const response = await lambda.send(command);

    if (!response.Code || !response.Code.Location) {
      throw new Error("Lambda code location URL not found.");
    }

    const downloadUrl = response.Code.Location;
    console.log("Download URL received.");

    await downloadFile(downloadUrl, outputPath);
    console.log(`Lambda code downloaded successfully → ${outputPath}`);
  } catch (err) {
    console.error("Error downloading Lambda:", err.message);
  }
}

// ---------- DOWNLOAD HELPER ---------- //
// function downloadFile(url, outputPath) {
//   return new Promise((resolve, reject) => {
//     const file = fs.createWriteStream(outputPath);

//     https
//       .get(url, (res) => {
//         if (res.statusCode !== 200) {
//           reject(new Error(`Failed to download. Status: ${res.statusCode}`));
//           return;
//         }

//         res.pipe(file);

//         file.on("finish", () => {
//           file.close();
//           resolve();
//         });
//       })
//       .on("error", (err) => {
//         fs.unlink(outputPath, () => {});
//         reject(err);
//       });
//   });
// }

const getFunction = (funcName) => {
  const command = new GetFunctionCommand({ FunctionName: funcName });
  return lambda.send(command);
};
// ---------- RUN ---------- //
// downloadLambda(FUNCTION_NAME, OUTPUT_FILE);
console.log(await getFunction("kovon-nurse-candidate-dev-getUser"));

const getLogs = async () => {
  // async/await.
  try {
    const client = new CloudWatchLogsClient({ region: REGION });
    const now = Date.now(); // current time in ms
    const FIVE_MIN = 5 * 60 * 1000;

    const params = {
      anomalyDetectorArn: "",
      startTime: "",
      endTime: "",
      maxResults: "",
    };
    const command = new ListAnomaliesCommand(params);
    const data = await client.send(command);
    // process data.
  } catch (error) {
    // error handling.
  } finally {
    // finally.
  }
};
