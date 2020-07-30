
const fs = require("fs");
const rp = require("request-promise");
const cheerio = require("cheerio");

module.exports = {
  getMyRank: (id) => {
    let buffer = fs.readFileSync(`data/${new Date().getFullYear()}.txt`);
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
  },
  callRequest: async (firstID, totalStudent) => {
    const total = firstID + totalStudent - 1;
    let array = [];
    try {
      for (let i = firstID; i <= total; i++) {
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
          console.log(`${i} :`, point);
        }).catch((e)=> console.log(i, e));
      }
      fs.writeFile(`data/${new Date().getFullYear()}.txt`, JSON.stringify(array), function (err) {
        if (err) console.log(err);
        console.log("Write file successfully");
      });
    } catch (error) {
      console.log(error);
    }
  }
}