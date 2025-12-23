import { exit } from "node:process";
import { createUserInCognito } from "./createUserInCognito.js";
import { patchUserDirectlyDB } from "./patchUserDirectlyDB.js";
import userData from "./userslist.json" with { type: "json" };
import * as fs from "node:fs/promises";
const now = Date.now()
export async function writeFailureMessage({ message }) {
  await fs.appendFile("./response/failedUserCreationLogs"+now+".txt", `${message}\n`, {
    flag: "a",
  });
}

export async function writeSuccessMessage({ message }) {
  await fs.appendFile(
    "./response/successUserCreationLogs"+now+".txt",
    `${message}\n`,
    { flag: "a" }
  );
}

async function main() {
  // console.log("clearing the previous logs")
   
  console.log("Starting the creation of User in cognito and db");
  const cognitoUrl = process.env.COGNITO_URL;
  const candidateUrl = process.env.CANDIDATE_URL;
  const ClientId = process.env.CLIENT_ID;

  if (!(cognitoUrl  || candidateUrl || ClientId)) {
    console.log("required variables are not available check the env file");
    return;
  }

  for (const user of userData) {
    try {
      await createUserInCognito({
        phoneNumber: user.phoneNumber,
        cognitoUrl,
        ClientId,
      });
      const payload = {
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
      };
      await patchUserDirectlyDB({ body: payload });
    } catch (error) {
      // await writeFailureMessage({message: error});
      console.log(error)
    }
  }
  return
}

await main();
