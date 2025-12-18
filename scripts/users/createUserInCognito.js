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

    const response = await signUp({
      ClientId,
      fullPhone: phoneNumber,
    });

    console.log("response from signup command: ", response);
    if (!response) {
      console.error(`${response.statusText}, ${response.status}`);
      await writeFailureMessage({
        message: `cognito -Status: failed -phonenumber: ${phoneNumber}`,
      });
      return;
    }
    console.log("User created in cognito successfully: ");
    await writeSuccessMessage({
      message: `cognito- status: success - phoneNUmber : ${phoneNumber}`,
    });
  } catch (error) {
    console.error(`Posting Error for ${phoneNumber}:`, error);
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
