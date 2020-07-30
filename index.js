const express = require("express");
const app = express();
const { getMyRank, callRequest } = require('./utils/math')

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));


// Render Homepage
app.get("/", (req, res) => {
  res.render("index", { success: null, data: null, error: null, id: '', faculty: 'cntt_k17' });
});

// Process a request send to the server
app.post("/", (req, res) => {

  console.log(req.body)

  let { id } = req.body;
  if (!id)
    return res.render("index", {
      success: false,
      error: "Mời bạn nhập ID",
      data: null
    });

  if (!req.body.faculty)
    return res.render("index", { success: false, error: "Sai mã khoa rồi", id: '', faculty: 'cntt_k17' });
  if (!req.body.id)
    return res.render("index", { success: false, error: "Bạn vui lòng nhập MSV", id: '', faculty: req.body.faculty });

  let data = getMyRank(id, req.body.faculty);

  if (!data) return res.render("index", { success: false, error: "Không tìm thấy MSV", id: '', faculty: 'cntt_k17' });
  if (data) return res.render("index", { success: true, data, error: null, id: req.body.id, faculty: req.body.faculty });
});

// Warning: Crawl a data again
app.get("/refresh-data", async (req, res) => {
  await callRequest(3117410000, 310);
  res.send({
    success: true,
    data: "Update new data"
  });
});

app.listen(port, () => {
  console.log(`Server open port ${port}`);
});

// callRequest(3117410001, 312);

// callRequest(3117320001, 403);

// console.log(getMyRank(3.17));


// 3117320001 