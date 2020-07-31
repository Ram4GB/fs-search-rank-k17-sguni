const express = require("express");
const fs = require("fs");
const app = express();
const { getMyRank, callRequest } = require("./utils/math");
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));

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

  console.log(req.body.faculty);

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
app.get("/refresh-data", async (req, res) => {
  const { username, password, firstId, total, name, value } = req.query;

  if (!username || !password || !firstId || !total || !name || !value)
    return res.send({
      success: false,
      data:
        "username, password, firstId, total, value: cntt_k17_hk[x: number]_[year: number], name: Công nghệ thông tin K17 HK2",
      link:
        "refresh-data?username=123&password=123&firstId=3117410027&name=cntt_k17_hk3_2019&value=Cong%20nghe%20thong%20tin%20k17%20hk%203&3&total=3",
    });

  if (username !== "admin" && password != "admin")
    return res.send({
      success: false,
      data: "Opssss, Username or password not match",
    });

  if (isNaN(firstId))
    return res.send({
      success: false,
      data: "firstId must be a number",
    });

  if (isNaN(total))
    return res.send({
      success: false,
      data: "total must be a number",
    });

  res.send({
    success: true,
    data: "Wait from 15mins to 30mins to get your result. Thanks",
  });

  // create new file in data
  await callRequest(parseInt(firstId), parseInt(total), value);

  // create new faculty
  try {
    let data = fs.readFileSync("./data/faculty.json");
    data = JSON.parse(data);
    data.push({ name, value });
    fs.writeFileSync("./data/faculty.json", JSON.stringify(data));
  } catch (error) {
    return res.send({
      success: false,
      data: "Server error",
    });
  }
});

app.listen(port, () => {
  console.log(`Server open port ${port}`);
});

// callRequest(3117410001, 312); // cntt k17 hk2 2020

// callRequest(3117320001, 403); // tài chính kế toán k17 hk2 2020

// callRequest(// 3117150092, 99); // gdth k17 hk2 2020

// callRequest(// 3117380376, 376); // Ngôn ngữ anh K17 HK2 2020 | nna_k17_hk2_2020

// console.log(getMyRank(3.17));
