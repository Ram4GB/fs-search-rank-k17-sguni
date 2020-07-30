const fs = require("fs");
const rp = require("request-promise");
const cheerio = require("cheerio");
const _ = require('lodash') 

module.exports = {
  getMyRank: (id, faculty) => {
    let buffer;

    if (!faculty) return null;
    if (!id) return null;

    buffer = fs.readFileSync(`./data/${faculty}.json`);

    let array = JSON.parse(buffer);
    array = array
      .sort(
        (a, b) =>
          parseFloat(a.point).toFixed(2) - parseFloat(b.point).toFixed(2)
      )
      .reverse();

    // get object
    let objectInArray = array.find((element) => {
      return parseInt(id) === parseInt(element.id);
    });

    if(!objectInArray) return null

    // get rank
    let rank = 0;
    for (let i = 0; i < array.length; i++) {
      if (parseInt(id) === parseInt(array[i].id)) {
        rank = i;
        break;
      }
    }

    let index = array.findIndex((a) => {
      parseFloat(a.point).toFixed(2) === parseFloat(objectInArray.point).toFixed(2)
    })

    let count = [];

    if(index !== -1) {
      for(let i = index ; i < array.length; i++) {
        if(parseFloat(array[i].point).toFixed(2) !== parseFloat(objectInArray.point).toFixed(2)) break;
        else {
          if(parseInt(array[i].id) !== parseInt(id)) count.push(array[i])
        }
      }
    }
    
    if (objectInArray)
      return { ...objectInArray, rank: rank + 1, total: array.length, count };
    return null;
  },
  callRequest: async (firstID, totalStudent, fileName) => {
    const total = firstID + totalStudent - 1;
    console.log(total);

    let array = [];
    try {
      for (let i = firstID; i <= total; i++) {
        await rp({
          url: `http://thongtindaotao.sgu.edu.vn/Default.aspx?page=xemdiemthi&id=${i}`,
          method: "GET",
        })
          .then((body) => {
            let $ = cheerio.load(body);

            // điểm học kì này
            let point = $(".row-diemTK .Label").eq(3).text();

            let point_contribution_lv10 = $(".row-diemTK .Label").eq(1).text();

            let point_contribution_lv4 = $(".row-diemTK .Label").eq(7).text();

            let session = $(".row-diemTK .Label").eq(11).text();

            if (point)
              array.push({
                id: i,
                point,
                point_contribution_lv10,
                point_contribution_lv4,
                session,
              });
            else
              array.push({
                id: i,
                point: "0.00",
                point_contribution_lv10: "0.00",
                point_contribution_lv4: "0.00",
                session: 0,
              });
            console.log(`${i} :`, point);
          })
          .catch((e) => console.log(i, e));
      }
      fs.writeFile(
        fileName
          ? `./data/${fileName}.json`
          : `./data/${new Date().getFullYear()}.json`,
        JSON.stringify(array),
        function (err) {
          if (err) console.log(err);
          console.log("Write file successfully");
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
};
