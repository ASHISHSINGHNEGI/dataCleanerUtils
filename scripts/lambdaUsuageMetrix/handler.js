import { LambdaClient, ListFunctionsCommand } from "@aws-sdk/client-lambda";
import { CloudWatchClient, GetMetricDataCommand } from "@aws-sdk/client-cloudwatch";
import fs from 'fs';
import functionList from './listOfFunction.json' with { type: 'json' };




const lambdaClient = new LambdaClient({});
const cloudwatchClient = new CloudWatchClient({});

async function getAllFunctionNames() {
    const functions = [];
    let nextToken;
    do {
        const data = await lambdaClient.send(
            new ListFunctionsCommand({ Marker: nextToken })
        );
        data.Functions?.forEach((fn) => functions.push(fn.FunctionName));
        nextToken = data.NextMarker;
    } while (nextToken);
    //save the function name in a file also in same dir
    fs.writeFile('functions.txt', functions.join('\n'), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    return functions;
}

async function getInvocationsForFunction(functionName, startTime, endTime) {
    // CloudWatch queries need unique Ids
    const metricQuery = [
        {
            Id: `invokes_${functionName.replace(/[^a-zA-Z0-9]/g, "")}`,
            MetricStat: {
                Metric: {
                    Namespace: "AWS/Lambda",
                    MetricName: "Invocations",
                    Dimensions: [
                        {
                            Name: "FunctionName",
                            Value: functionName,
                        },
                    ],
                },
                Period: 86400, // 1-day period for a 3-month range
                Stat: "Sum",
            },
        },
    ];

    const params = {
        StartTime: startTime,
        EndTime: endTime,
        MetricDataQueries: metricQuery,
    };

    const data = await cloudwatchClient.send(
        new GetMetricDataCommand(params)
    );

    const result = data.MetricDataResults[0];
    return (result.Values || []).reduce((sum, v) => sum + v, 0);
}

(async function main() {
    try {
        const endTime = new Date();
        const startTime = new Date();
        startTime.setMonth(endTime.getMonth() - 6);

        console.log(
            `Fetching invocation counts from ${startTime.toISOString()} to ${endTime.toISOString()}`
        );

        // const functionNames = await getAllFunctionNames();
        // console.log(`Found ${functionNames.length} functions`)

        const results = await Promise.all(
            functionList.map(async (fn) => {
                const count = await getInvocationsForFunction(
                    fn,
                    startTime,
                    endTime
                );
                return { fn, count };
            })
        );

        results.sort((a, b) => b.count - a.count);

        const logStream = fs.createWriteStream("./scripts/lambdaUsuageMetrix/invocation_report.txt", { flags: "w" });
        const log = (msg) => {
            // console.log(msg);
            logStream.write(`${msg}\n`);
        };

        log("Function Name\tInvocation Count");
        results.forEach(({ fn, count }) =>
            log(`${fn}\t${count}`)
        );
    } catch (err) {
        console.error("Error:", err);
    }
})();