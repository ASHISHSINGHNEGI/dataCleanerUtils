import { writeFailureMessage, writeSuccessMessage } from "./postUser";

async function patchUserThroughtApi({ body }) {
  console.log("function patch User");
  try {
    console.log(body);

    const response = fetch(process.env.CANDIDATE_URL + "/users/me", {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.6",
        authorization: `Bearer ${ACCESS_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
      method: "PATCH",
    });

    if (!response.ok) {
      console.error(`${response.statusText}, ${response.status}`);
      await writeFailureMessage({
        message: `User Patch : Status: Failed, ${response.status}`,
      });
      return;
    }
    const resultData = result.data;
    console.log("User successfully patched : ", resultData);
    await writeSuccessMessage({
      message: `User -phoneNumber : ${phoneNumber}`,
    });
  } catch (error) {}
}
