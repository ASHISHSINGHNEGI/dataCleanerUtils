import * as fs from "node:fs/promises";
// import userData from "../../../kovon/resourse/prachiUserListUpdated/userListUpdatesByPrachi_2Jan25.json";
import userData from "../../../kovon/resourse/prachiUserListUpdated/userListUpdatesByPrachi_8Jan25_6pm(updated).json" with { type: "json" };
import { connect } from "../../mongoose/mongoose.js";
import { createUserInCognito } from "./createUserInCognito.js";
import { patchUserDirectlyDB } from "./patchUserDirectlyDB.js";
const now = Date.now();
export async function writeFailureMessage({ message }) {
  await fs.appendFile(
    "./response/failedUserCreationLogs" + now + ".txt",
    `${message}\n`,
    {
      flag: "a",
    }
  );
}

export async function writeSuccessMessage({ message }) {
  await fs.appendFile(
    "./response/successUserCreationLogs" + now + ".txt",
    `${message}\n`,
    { flag: "a" }
  );
}

async function main() {
  // console.log("clearing the previous logs")
  console.log("Starting the creation of User in cognito and db");
  const cognitoUrl = process.env.COGNITO_URL;
  const candidateUrl = process.env.CANDIDATE_URL_DEV;
  const ClientId = process.env.CLIENT_ID;
  await connect();

  if (!(cognitoUrl || candidateUrl || ClientId)) {
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
        targetCountry: {
          name: user["targetCountry.name"],
          id: user["targetCountry.name_id"],
        },
        targetJobRole: {
          name: user["targetJobRole.name"],
          id: user["targetJobRole._id"],
        },
      };

      if (user.secondaryJobRoles) {
        payload.secondaryJobRoles = user.secondaryJobRoles_raw
          ? user.secondaryJobRoles_raw.split("|").map((item) => {
              const [id, name] = item.split(":");
              return { id, name };
            })
          : [];
      }

      await patchUserDirectlyDB({ body: payload });
    } catch (error) {
      // await writeFailureMessage({message: error});
      console.log(error);
    }
  }
  return;
}

await main();
