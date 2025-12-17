const date = new Date();

console.log("date: ", date);
console.log("now : ", date.getDate());
// console.log("full year: ", date.getFullYear());
// console.log("month: ", date.getMonth());
// console.log("hr: ", date.getHours());
// console.log("mins=: ", date.getMinutes());
// console.log("secs: ", date.getSeconds());
// console.log("secs in utc: ", date.getUTCSeconds());
// console.log("day: ", date.getDay());

console.log("date before 24 hrs");
console.log("24 hrs before", new Date(date.getTime() - 24 * 60 * 60 * 1000));
console.log("time in ist");
console.log(date.toLocaleString("en-US", { timeZone: "Asia/kolkata" }));
