
const baseUrl = 'https://zj5sfb8b82.execute-api.ap-south-1.amazonaws.com/dev/';
const token = "eyJraWQiOiJYdVVVM0RwWlZIK01ubncrUnZcL20rM1VMUTFJM296clYzck5LNm1oTldmaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MTgzOWQxYS05MDAxLTcwNGUtMzc3ZS00OTQ2OGJlZDU0OTkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX3lrbWh6bzhXVyIsImNsaWVudF9pZCI6IjM2amx2aHVnMXRnNHBhNTc3bnRoZmhhNTRoIiwib3JpZ2luX2p0aSI6ImJkMmRhZWUxLTM4MDMtNGM2Zi05YWUyLWNiNjdhMTE5MzI3MSIsImV2ZW50X2lkIjoiY2M4OTZlYjEtZGJjOS00MzIxLWJkMjEtOTNhNmQ2OTBjZTFjIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc3MDIxNTExMiwiZXhwIjoxNzcwMjE4NzEyLCJpYXQiOjE3NzAyMTUxMTIsImp0aSI6ImUzODgxNDM4LWE2ZWQtNGVkNi1iMzUyLTFlMGI0MDNhNTQyNSIsInVzZXJuYW1lIjoiNTE4MzlkMWEtOTAwMS03MDRlLTM3N2UtNDk0NjhiZWQ1NDk5In0.hmxlvRVacBu36QdMLkX-8hr5pXrjpfGdRz_FKHTvkBFeJLfaAJ7u3uP-5DEvu1Hxjw7g6-42mXPnoYjSO-ONg4w9m5gsMI2XaUhqfqbvJZOhx4jfnVc8OEE4aSNctjSYxvm3uLoKxysjVyCVjtdEmNhP8MZ5DAbdriLRDVObsTlQnB2uvZp9aS-kHUoVYtJBWwXwPkJ0N2eInayZNaFd3vogB-jAxukBbFF2zSnOe4W1yaDNkB_yXnnh_6kghxSl5b1FiLi4CNjyWN_iZtucTtGbJ6f3j4-q3dhC3qB-XUUZSCwBEpNe3qEqnaWqUd391go9m99sx1d-r-23MKWpgg"
const jobIdList = [
    // "692d47bb6cb8ef66cdc7ceb8",
    // "692d47bb6cb8ef66cdc7ceca",
    // "692d47bb6cb8ef66cdc7cee2",
    // "692d47be6cb8ef66cdc7d6d5",
    // "692d47bc6cb8ef66cdc7cff5",
    // "692d47bf6cb8ef66cdc7d72e",
    "692d47bf6cb8ef66cdc7d72c"

];
const countriesList = [
    "Kenya",
    // "Nigeria",
    // "Egypt",
    // "New Zealand",
    // "Fiji",
    // "Papua New Guinea",
    // "Bahrain",
    // "Uzbekistan",
    // "United Arab Emirates",
    // "Saudi",
    // "Qatar",
];

//comination of jobid and country
const combination = jobIdList.flatMap((jobId) => countriesList.map((country) => ({ jobId, country })));
console.log(combination);

const jobData = {
    "title": "Senior Machine Operator",
    "description": "Operation and maintenance of pharmaceutical grade machinery.",
    "location": {
        "country": "Saudi Arabia",
        "remote": false
    },
    "status": "PUBLISHED",
    "company": {
        "name": "TechFlow Innovations",
        "id": "65b9876543210fedcba98765"
    },
    "jobCategory": {
        "name": "Lab Pharma",
        "id": "692ebff886104586316a1cc4"
    },
    "jobRole": {
        "name": "Senior Pharmaceutical Machine Operator",
        "id": "692d47bf6cb8ef66cdc7d72e"
    },
    "isActive": true,
    "dateOfExpiration": "2027-01-31",
    "type": "FULL-TIME",
    "gender": "any",
    "mode_of_apply": "Email",
    "salary": {
        "min": 100,
        "max": 500,
        "currency": "USD",
        "frequency": "Month"
    }
};

// post job for each combination
for (const { jobId, country } of combination) {
    const tempJobData = {
        ...jobData,
        title: "Senior Machine Operator at " + country,
        location: {
            country,
            remote: false
        },
        jobRole: {
            name: "testing jobs",
            id: jobId
        }
    };
    console.log(tempJobData);
    //need to post 2 jobs for each combination
    // await postJob(tempJobData);

    const noOfJobPosts = 3;
    for (let i = 0; i < noOfJobPosts; i++) {
        await postJob(tempJobData)
    }

}

/*
curl --location --request POST 'https://zj5sfb8b82.execute-api.ap-south-1.amazonaws.com/dev/candidate/jobs' \
--header 'Authorization: Bearer eyJraWQiOiJYdVVVM0RwWlZIK01ubncrUnZcL20rM1VMUTFJM296clYzck5LNm1oTldmaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI1MTgzOWQxYS05MDAxLTcwNGUtMzc3ZS00OTQ2OGJlZDU0OTkiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuYXAtc291dGgtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aC0xX3lrbWh6bzhXVyIsImNsaWVudF9pZCI6IjM2amx2aHVnMXRnNHBhNTc3bnRoZmhhNTRoIiwib3JpZ2luX2p0aSI6ImNhZmFkNzQ5LThhY2MtNDZmNS1iZWY0LWIxYmUwNjcyNjc3YiIsImV2ZW50X2lkIjoiMDQwNmI2Y2UtYzg5NS00NjU3LWIyZDUtZTUzNDBkYzMzOGFiIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTc3MDIwNjE1MiwiZXhwIjoxNzcwMjA5NzUyLCJpYXQiOjE3NzAyMDYxNTIsImp0aSI6IjE1ODFhZTkyLTBmZWYtNDM4OC1iMzIwLTFiNmIxMGViNDEwNCIsInVzZXJuYW1lIjoiNTE4MzlkMWEtOTAwMS03MDRlLTM3N2UtNDk0NjhiZWQ1NDk5In0.BD-TI3tlRZeACKLzTf0sIZSmMVCbFNfmEbwqpLeqlx-HTJNu6RbJFLJLBzrGBE5g8VjwWdqBvTVfMzFWEpIGxNFdkH8ukY0Z8gOtJ3XJseipIPYuweve8jnZqOtUwZsMBdmZizcWJpp-7iruLH9J-oLo4IAUUnu98AhYWgo3MOZfzFipVXfkWRnTE9wOmTld7V-l_9LMd-S22MtNx4F2YgO9tCkuU1UpCwYXMjob_OD_yVZ-9CsauCQvyo6OIr1jlf09yspOG0Pz-0d8-ue3TK9CB8ADlQ-yejiLhNSUbrkZOYGySdsyg4B11_hHMp_2TbO8M76Gz3HrZ3vWp7XErg' \
--data ''
*/


async function postJob(jobData) {
    const response = await fetch(baseUrl + '/candidate/jobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(jobData)
    });
    const data = await response.json();
    console.log(data);
}
