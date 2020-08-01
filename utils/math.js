const fs = require("fs");
const rp = require("request-promise");
const cheerio = require("cheerio");
const _ = require("lodash");
const { request } = require("http");
const util = require("util");


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

    if (!objectInArray) return null;

    // get rank

    // let rank = 0;
    // for (let i = 0; i < array.length; i++) {
    //   if (parseInt(id) === parseInt(array[i].id)) {
    //     rank = i;
    //     break;
    //   }
    // }

    // get rank
    let index = array.findIndex((m) => {
      return m.point == objectInArray.point;
    });

    let count = [];

    if (index !== -1) {
      for (let i = index; i < array.length; i++) {
        if (array[i].point !== objectInArray.point) break;
        else {
          if (parseInt(array[i].id) !== parseInt(id)) count.push(array[i]);
        }
      }
    }

    if (objectInArray)
      return { ...objectInArray, rank: index, total: array.length, count };
    return null;
  },
  callRequest: async (firstID, totalStudent, fileName) => {
    const total = firstID + totalStudent - 1;
    let array = [];
    let requests = [];
    try {
      for (let i = firstID; i <= total; i++) {
        requests.push(createSingleStudentInfo(i));
      }

      array = await Promise.all(requests);
      console.log(util.inspect(array, false, null, true /* enable colors */));

      fs.writeFile(
        fileName
          ? `./data/${fileName}.json`
          : `./data/${new Date().getFullYear()}.json`,
        JSON.stringify(array),
        function (err) {
          console.log("Done ", err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
};

const createSingleStudentInfo = async (id) => {
  try {
    const body = await rp({
      url: `http://thongtindaotao.sgu.edu.vn/Default.aspx?page=xemdiemthi&id=${id}`,
      method: "GET",
    });

    let $ = cheerio.load(body);

    // điểm học kì này
    let point = $(".row-diemTK .Label").eq(3).text();

    let point_contribution_lv10 = $(".row-diemTK .Label").eq(1).text();

    let point_contribution_lv4 = $(".row-diemTK .Label").eq(7).text();

    let session = $(".row-diemTK .Label").eq(11).text();

    console.log(`create single student info method id: ${id}`);
    if (point)
      return {
        id,
        point,
        point_contribution_lv10,
        point_contribution_lv4,
        session,
      };
    return {
      id,
      point: "0.00",
      point_contribution_lv10: "0.00",
      point_contribution_lv4: "0.00",
      session: 0,
    };
  } catch (error) {
    console.log(`create single student info: ${error}`);
  }
};
