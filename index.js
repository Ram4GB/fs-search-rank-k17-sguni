const express = require("express");
const app = express();
const { getMyRank, callRequest } = require('./utils/math')

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));


// Render Homepage
app.get("/", (req, res) => {
  res.render("index", { success: null, data: null, error: null });
});

// Process a request send to the server
app.post("/", (req, res) => {
  let { id } = req.body;
  if (!id)
    return res.render("index", {
      success: false,
      error: "Mời bạn nhập ID",
      data: null
    });
  let data = getMyRank(id);
  if (data) return res.render("index", { success: true, data, error: null });
  return res.render("index", { success: false, error: "Không tìm thấy MSV" });
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

// console.log(getMyRank(3.17));
