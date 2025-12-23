import { writeFailureMessage, writeSuccessMessage } from "./postJobs.js";

export async function postJobApiCall({ url, data }) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
    },
  });
  const result = await response.json();

  if (!response.ok) {
    console.error(`${response.statusText}, ${response.status}`);
    await writeFailureMessage({
      job: data,
      message: `Status: ${response.status}. , ${response.statusText}`,
    });
    return;
  }
  const resultData = result.data;
  console.log(
    "Job posted successfully: ",
    resultData.title,
    " & _id: ",
    resultData._id
  );
  await writeSuccessMessage({ job: resultData });
}
