import employerData from "../data/raListCleaned.json" with { type: "json" };
import { employerUserModel } from "../mongoose/models/employerUser.model.js";
import { connect } from "../mongoose/mongoose.js";

async function populateEmployerUser() {
    try {
        await connect();
        console.log({
            message: "data length",
            data: employerData.length,
        });

        await Promise.all(
            employerData.map(async (employer) => {
                let employerDataInDb = await employerUserModel.findOne({
                    registrationNumber: employer["RA Registration No"]
                }).lean();
                if (employerDataInDb) {
                    console.log({
                        message: "employer data already present in db",
                        data: employerDataInDb,
                    });
                } else {
                    const data = {
                        fullName: employer["Owner Name"],
                        phoneNumber: employer["Mobile"],
                        email: employer["Email"],
                        registrationNumber: employer["RA Registration No"],
                        company: {
                            name:employer["Company Name"]
                        },
                        address: {
                            line2: employer["Area"],
                            city: employer["City"],
                            state: employer["State"],
                            country: "India"
                        },
                        licenseNumber: employer["License Number"],
                        status: employer["Status"]==="Active"? true: false
                    };
                    console.log({
                        message: "data for posting",
                        data,
                    });
                    employerDataInDb = await employerUserModel.create(data);
                    console.log({
                        message: "post successful",
                        data: employerDataInDb,
                    });
                }
                console.log("All categories and job roles processed successfully.");
            })

        )
    } catch (error) {
        console.error({
            message: "Internal server error during data population",
            error: error.message,
            stack: error.stack,
        });
    }
}



await populateEmployerUser();
