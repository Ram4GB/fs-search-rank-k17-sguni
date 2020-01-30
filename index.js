const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));

async function callRequest(firstID, totalStudent) {
  const total = firstID + totalStudent;
  let array = [];
  try {
    for (let i = firstID; i < total; i++) {
      await rp({
        url: `http://thongtindaotao.sgu.edu.vn/Default.aspx?page=xemdiemthi&id=${i}`,
        method: "GET"
      }).then(body => {
        let $ = cheerio.load(body);
        let point = $(".row-diemTK .Label")
          .eq(3)
          .text();
        if (point) array.push({ id: i, point });
        else array.push({ id: i, point: "0.00" });
        console.log(point);
      });
    }
    fs.writeFile("data.txt", JSON.stringify(array), function(err) {
      if (err) console.log(err);
      console.log("Write file successfully");
    });
  } catch (error) {
    console.log(error);
  }
}

function getMyRank(id) {
  let buffer = fs.readFileSync("data.txt");
  let array = JSON.parse(buffer);
  array = array
    .sort(
      (a, b) => parseFloat(a.point).toFixed(2) - parseFloat(b.point).toFixed(2)
    )
    .reverse();
  // get object
  let objectInArray = array.filter(element => {
    return parseInt(id) === element.id;
  });
  // get rank
  let rank = array.findIndex(element => {
    return parseInt(id) === element.id;
  });
  if (objectInArray.length == 1)
    return { ...objectInArray[0], rank: rank + 1, total: array.length };
  return null;
}

app.get("/", (req, res) => {
  res.render("index", { success: null, data: null, error: null });
});

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

// callRequest(3117410000, 310);

// console.log(getMyRank(3.17));
