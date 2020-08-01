const express = require("express");
const fs = require("fs");
const app = express();
const { getMyRank } = require("./utils/math");
const { algorithm } = require("./utils/core_process");
const port = process.env.PORT || 8080;
const cors = require("cors");
var schedule = require("node-schedule");
const util = require("util");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));

const test = async () => {
  console.log("Lets check some schedule");
  let data = fs.readFileSync("./data/schedule.json");
  data = JSON.parse(data);
  let arr = [];
  for (let i = 0; i < data.length; i++) arr.push(algorithm(data[i]));
  if (arr.length > 0) {
    try {
      const result = await Promise.all(arr);
      console.log(util.inspect(result, false, null, true /* enable colors */));
    } catch (error) {
      console.log(error);
    }
    fs.writeFileSync("./data/schedule.json", JSON.stringify([]));
  }
}

test();

schedule.scheduleJob({ hour: 17, minute: 33 }, async function () {
  console.log("Lets check some schedule");
  let data = fs.readFileSync("./data/schedule.json");
  data = JSON.parse(data);
  let arr = [];
  for (let i = 0; i < data.length; i++) arr.push(algorithm(data[i]));
  if (arr.length > 0) {
    try {
      const result = await Promise.all(arr);
      console.log(util.inspect(result, false, null, true /* enable colors */));
    } catch (error) {
      console.log(error);
    }
    fs.writeFileSync("./data/schedule.json", JSON.stringify([]));
  }
});

const getListFaculty = (req, res, next) => {
  try {
    let data = fs.readFileSync("./data/faculty.json");
    data = JSON.parse(data);
    req.faculty_array_server = data;
    next();
  } catch (error) {
    req.faculty_array_server = [];
    next();
  }
};

app.use(getListFaculty);

// Render Homepage
app.get("/", (req, res) => {
  res.render("index", {
    success: null,
    data: null,
    error: null,
    id: "",
    faculty: "cntt_k17",
    faculty_array_server: req.faculty_array_server,
  });
});

// Process a request send to the server
app.post("/", (req, res) => {
  let { id } = req.body;

  if (!id)
    return res.render("index", {
      success: false,
      error: "Mời bạn nhập ID",
      data: null,
      id: "",
      faculty: "cntt_k17",
      faculty_array_server: req.faculty_array_server,
    });

  if (!req.body.faculty)
    return res.render("index", {
      success: false,
      error: "Sai mã khoa rồi",
      id: "",
      faculty: "cntt_k17",
      faculty_array_server: req.faculty_array_server,
    });
  if (!req.body.id)
    return res.render("index", {
      success: false,
      error: "Bạn vui lòng nhập MSV",
      id: "",
      faculty: req.body.faculty,
      faculty_array_server: req.faculty_array_server,
    });

  let data = getMyRank(id, req.body.faculty);

  if (!data)
    return res.render("index", {
      success: false,
      error: "Không tìm thấy MSV",
      id: "",
      faculty: "cntt_k17",
      faculty_array_server: req.faculty_array_server,
    });
  if (data)
    return res.render("index", {
      success: true,
      data,
      error: null,
      id: req.body.id,
      faculty: req.body.faculty,
      faculty_array_server: req.faculty_array_server,
    });
});

// Warning: Crawl a data again
app.post("/refresh-data", async (req, res) => {
  const { username, password, firstId, total, name, value } = req.body;

  if (!username || !password || !firstId || !total || !name || !value)
    return res.send({
      success: false,
      error:
        "username, password, firstId, total, value: cntt_k17_hk[x: number]_[year: number], name: Công nghệ thông tin K17 HK2",
      link:
        "refresh-data?username=123&password=123&firstId=3117410027&name=cntt_k17_hk3_2019&value=Cong%20nghe%20thong%20tin%20k17%20hk%203&3&total=3",
    });

  if (username !== "admin" && password != "admin")
    return res.send({
      success: false,
      error: "Opssss, Username or password not match",
    });

  if (isNaN(firstId))
    return res.send({
      success: false,
      error: "firstId must be a number",
    });

  if (isNaN(total))
    return res.send({
      success: false,
      error: "total must be a number",
    });

  let data = fs.readFileSync("./data/schedule.json");

  data = JSON.parse(data);
  data.push({
    firstId,
    total,
    name,
    value,
  });
  fs.writeFileSync("./data/schedule.json", JSON.stringify(data));

  res.send({
    success: true,
    error: "Schedule was set",
  });
});

app.get("/list-request", (req, res) => {
  let data = fs.readFileSync("./data/schedule.json");
  data = JSON.parse(data);

  res.render("new-request", {
    success: true,
    data,
  });
});

app.listen(port, () => {
  console.log(`Server open port ${port}`);
  // khi start server thì chạy schedule liền
});

// callRequest(3117410001, 312); // cntt k17 hk2 2020

// callRequest(3117320001, 403); // tài chính kế toán k17 hk2 2020

// callRequest(// 3117150092, 99); // gdth k17 hk2 2020

// callRequest(// 3117380376, 376); // Ngôn ngữ anh K17 HK2 2020 | nna_k17_hk2_2020

// console.log(getMyRank(3.17));
