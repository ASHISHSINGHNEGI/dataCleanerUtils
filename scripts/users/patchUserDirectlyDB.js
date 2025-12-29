import { User } from "../../mongoose/models/users.model.js";
import { connect, disconnect } from "../../mongoose/mongoose.js";
import { writeFailureMessage, writeSuccessMessage } from "./main.js";

export async function patchUserDirectlyDB({ body }) {
  console.log("Starting to patch user*************");
  try {
    const { phoneNumber, ...updates } = body;
    await connect();
    const response = await User.findOneAndUpdate(
      { phoneNumber },
      { $set: updates },
      {
        new: true,
      }
    );
    if (!response) {
      console.error(`Failed updatation for ${phoneNumber}`);
      await writeFailureMessage({
        message: `User Patch : Status: Failed, ${phoneNumber}`,
      });
      return;
    }
    console.log("User successfully patched : ", response._id);
    await writeSuccessMessage({
      message: `User -phoneNumber : ${phoneNumber}`,
    });
    // await disconnect();
  } catch (error) {
    console.log(error);
    // await disconnect();
  }
}
