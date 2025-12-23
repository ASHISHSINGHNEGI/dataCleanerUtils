import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { writeFailureMessage, writeSuccessMessage } from "./main.js";

//this function will call the cognito and and patch the user to db
export async function createUserInCognito({
  phoneNumber,
  cognitoUrl,
  ClientId,
}) {
  try {
    console.log("function - createUserInCognito");
    const payload = {
      ClientId,
      Username: phoneNumber,
      Password: "Z.AEOo*.f9Y9",
      UserAttributes: [{ Name: "phone_number", Value: phoneNumber }],
    };
    console.log({ payload });

    console.log("now calling signup command");
    let response;
    try {
      response = await signUp({
        ClientId,
        fullPhone: phoneNumber,
      });
    } catch (error) {
      console.log({
        message: "error while creating user in cognito",
        faultCause: error["$fault"],
        statusCode: error.$metadata.httpStatusCode,
        name: error.name,
        message: error.message,
        __type: error.__type,
      });

      //handling the user already exist exception from cognito
      if (error.name === "UsernameExistsException") {
        console.error("User already exists(cognito)");
        await writeSuccessMessage({
          message: `cognito- status:${error.message} phoneNUmber : ${phoneNumber}`,
        });
        return;
      }
      throw error;
    }
    console.log("User created in cognito successfully");
    console.log(response);
    await writeSuccessMessage({
      message: `cognito- status: success - phoneNUmber : ${phoneNumber}`,
    });
  } catch (error) {
    // console.error(`Posting Error for ${phoneNumber}:`, error);
    console.log("keys of error : ", Object.entries(error));
    throw new Error(
      `Cognito -Status: ${error.message} -phonenumber: ${phoneNumber}`
    );
  }
}

const signUp = async ({ ClientId, fullPhone }) => {
  const client = new CognitoIdentityProviderClient({ region: "ap-south-1" });

  return await client.send(
    new SignUpCommand({
      ClientId,
      Username: fullPhone,
      Password: "/Q]Wq6'G1qcL",
      UserAttributes: [{ Name: "phone_number", Value: fullPhone }],
    })
  );
};
