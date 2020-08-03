const express = require("express");
var schedule = require("node-schedule");
const fs = require("fs");
const cors = require("cors");
const util = require("util");

// Controllers
const controllers = require("./controllers/index");

const app = express();
const port = process.env.PORT || 8080;
const scheduleFilePath = "./data/schedule.json";
const { algorithm, pathFaculty } = require("./utils/core_process");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));

// Run every 5 minutes
var rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 5);

// schedule.scheduleJob(rule, async function(){
//   console.log("Lets check some schedule");
//   let data = fs.readFileSync(scheduleFilePath);
//   data = JSON.parse(data);
//   let arr = [];
//   for (let i = 0; i < data.length; i++) arr.push(algorithm(data[i]));
//   if (arr.length > 0) {
//     try {
//       const result = await Promise.all(arr);
//       console.log(util.inspect(result, false, null, true /* enable colors */));
//     } catch (error) {
//       console.log(error);
//     }
//     fs.writeFileSync(scheduleFilePath, JSON.stringify([]));
//   }
// });

const readScheduleFileAndCrawl = async () => {
  let data = fs.readFileSync(scheduleFilePath);
  data = JSON.parse(data);
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    try {
      // this function do not return anything so we do not have to console this, just await
      await algorithm(data[i]);
    } catch (error) {
      console.log(error);
    }
  }
  fs.writeFileSync(scheduleFilePath, JSON.stringify([]));
};

readScheduleFileAndCrawl();

const getListFaculty = (req, res, next) => {
  try {
    let data = fs.readFileSync(pathFaculty);
    data = JSON.parse(data);
    req.faculty_array_server = data;
    next();
  } catch (error) {
    req.faculty_array_server = [];
    next();
  }
};

/* middleware to get faculty file */
app.use(getListFaculty);

// Render Homepage
app.get("/", controllers.renderHomepage);

// Process a request send to the server
app.post("/", controllers.getRank);

// add new request to schedule file
app.post("/refresh-data", controllers.addRequestToSchedules);

// return list request schedules file
app.get("/list-request", controllers.listRequest);

app.listen(port, () => {
  console.log(`Server open port ${port}`);
  // khi start server thì chạy schedule liền
});
