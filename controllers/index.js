const dayjs = require('dayjs');
const uuid = require('uuid');
const { getMyRank } = require('../utils/math')
const fs = require('fs')
const scheduleFilePath = './data/schedule.json'

module.exports = {
  getRank: (req, res) => {
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
  },
  addRequestToSchedules: async (req, res) => {
    const {
      username,
      password,
      firstId,
      total,
      name,
      value,
      datetimeRequest,
    } = req.body;

    if (!username || !password || !firstId || !total || !name || !value)
      return res.send({
        success: false,
        error:
          "username, password, firstId, total, value: cntt_k17_hk[x: number]_[year: number], name: Công nghệ thông tin K17 HK2 ,datetimeRequest: new Date()",
        link:
          "refresh-data?username=123&password=123&firstId=3117410027&name=cntt_k17_hk3_2019&value=Cong%20nghe%20thong%20tin%20k17%20hk%203&3&total=3",
      });

    if (username !== "admin" && password != "123")
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

    let data = fs.readFileSync(scheduleFilePath);

    data = JSON.parse(data);
    data.push({
      firstId,
      total,
      name,
      value,
      datetimeRequest: `${dayjs().format("DD/MM/YYYY | HH:mm:a")}`,
      id: uuid.v4(),
    });
    fs.writeFileSync(scheduleFilePath, JSON.stringify(data));

    res.send({
      success: true,
      error: "Schedule was set",
    });
  },
  listRequest: (req, res) => {
    let data = fs.readFileSync(scheduleFilePath);
    data = JSON.parse(data);

    res.render("new-request", {
      success: true,
      data,
    });
  },
  renderHomepage: (req, res) => {
    res.render("index", {
      success: null,
      data: null,
      error: null,
      id: "",
      faculty: "cntt_k17",
      faculty_array_server: req.faculty_array_server,
    });
  }
};
