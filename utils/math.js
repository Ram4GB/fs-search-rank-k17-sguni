const fs = require("fs");
const rp = require("request-promise");
const cheerio = require("cheerio");
const util = require("util");
const fileStorePath = './stores'

module.exports = {
  getMyRank: (id, faculty) => {
    let buffer;

    if (!faculty) return null;
    if (!id) return null;

    buffer = fs.readFileSync(`${fileStorePath}/${faculty}.json`);

    let array = JSON.parse(buffer);
    array = array
      .sort(
        (a, b) =>
          parseFloat(a.point_lv10).toFixed(2) - parseFloat(b.point_lv10).toFixed(2)
      )
      .reverse();

    // get object
    let objectInArray = array.find((element) => {
      return parseInt(id) === parseInt(element.id);
    });

    if (!objectInArray) return null;

    // get rank
    let index = array.findIndex((m) => {
      return m.point_lv10 == objectInArray.point_lv10;
    });

    let count = [];

    if (index !== -1) {
      for (let i = index; i < array.length; i++) {
        if (array[i].point_lv10 !== objectInArray.point_lv10) break;
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
          ? `${fileStorePath}/${fileName}.json`
          : `${fileStorePath}/${new Date().getFullYear()}.json`,
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
    let point_lv10 = $(".row-diemTK .Label").eq(1).text();
    
    let point = $(".row-diemTK .Label").eq(3).text();

    let point_contribution_lv10 = $(".row-diemTK .Label").eq(5).text();

    let point_contribution_lv4 = $(".row-diemTK .Label").eq(7).text();

    let credit_reached = $(".row-diemTK .Label").eq(9).text();

    let session = $(".row-diemTK .Label").eq(11).text();

    console.log(`create single student info method id: ${id}`);
    if (point)
      return {
        id,
        point,
        point_lv10,
        point_contribution_lv4,
        point_contribution_lv10,
        session,
        credit_reached
      };
    return {
      id,
      point: "0.00",
      point_lv10: "0.00",
      point_contribution_lv4: "0.00",
      point_contribution_lv10:"0,00",
      session: 0,
      credit_reached: 0
    };
  } catch (error) {
    console.log(`create single student info: ${error}`);
  }
};
