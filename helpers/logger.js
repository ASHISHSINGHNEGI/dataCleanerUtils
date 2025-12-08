export function logger(message) {
  const stage = process.env.STAGE;
  if (!stage) {
    throw new Error("STAGE environment variable is not set");
  }
  if (stage !== "prod") {
    console.log(JSON.stringify(message, null, 2));
  }
}
