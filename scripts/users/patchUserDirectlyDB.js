import { User } from "../../mongoose/models/users.model.js";
import { connect } from "../../mongoose/mongoose.js";
import { writeFailureMessage, writeSuccessMessage } from "./main.js";

export async function patchUserDirectlyDB({ body }) {
  console.log("function patch User");
  try {
    console.log(body);
    const phoneNumber = body.phoneNumber;
    await connect();
    const response = await User.findOneAndUpdate(
      { phoneNumber },
      { $set: body }
    );
    if (!response) {
      console.error(`Failed updatation for ${phoneNumber}`);
      await writeFailureMessage({
        message: `User Patch : Status: Failed, ${phoneNumber}`,
      });
      return;
    }
    console.log("User successfully patched : ", response);
    await writeSuccessMessage({
      message: `User -phoneNumber : ${phoneNumber}`,
    });
  } catch (error) {
    console.error(`Failed updatation for ${body.phoneNumber}`);
    console.log(error);
    await writeFailureMessage({
      message: `User Patch : Status: Failed, ${body.phoneNumber}`,
    });
    return;
  }
}
