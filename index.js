import { functionName } from "./scripts/data/functionListDev.js";
import { saveLambdaLogs } from "./scripts/saveLambdaLogs.js";

await Promise.all(functionName.map((name) => saveLambdaLogs(name, 24)));
