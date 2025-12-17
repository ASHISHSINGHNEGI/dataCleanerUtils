import fs from "fs";
import path from "path";
import {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
} from "@aws-sdk/client-cloudwatch-logs";

// --------------------------------------------
const client = new CloudWatchLogsClient({ region: "ap-south-1" });
// --------------------------------------------

/**
 * Fetch logs for a Lambda function and save to a file.
 * @param {string} functionName - The AWS Lambda function name.
 * @param {number} sinceMinutes - How many minutes of logs to fetch.
 */
export async function saveLambdaLogs(functionName, sinceHrs = 10) {
  const logGroupName = `/aws/lambda/${functionName}`;
  const now = Date.now();
  const startTime = now - sinceHrs * 60 * 60 * 1000;
  const outputPath = `data/logs/${functionName}-logs.log`;
  const outputFile = path.join(process.cwd(), outputPath);
  const writeStream = fs.createWriteStream(outputFile, { flags: "w" });

  let nextToken = undefined;

  try {
    console.log(`Fetching logs for: ${functionName}`);
    console.log(`Writing output to: ${outputFile}`);

    while (true) {
      const command = new FilterLogEventsCommand({
        logGroupName,
        startTime,
        nextToken,
        interleaved: true,
      });

      const response = await client.send(command);

      if (response.events && response.events.length > 0) {
        response.events.forEach((event) => {
          const ts = new Date(event.timestamp).toISOString();
          writeStream.write(`[${ts}] ${event.message.trim()}\n`);
        });
      }

      if (!response.nextToken) break;
      nextToken = response.nextToken;
    }

    writeStream.end();
    console.log("Done! Logs saved.");
  } catch (err) {
    console.error("Error fetching logs:", err.message);
    writeStream.end();
  }
}
