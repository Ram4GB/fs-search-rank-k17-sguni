const fs = require('fs')
const { callRequest } = require("../utils/math");

module.exports = {
  algorithm: async ({firstId, total, name, value}) => {
    // load file schedule
    let data = fs.readFileSync('./data/schedule.json')
    // create new file in data
    await callRequest(parseInt(firstId), parseInt(total), value);
    // create new faculty
    try {
      let data = fs.readFileSync("./data/faculty.json");
      data = JSON.parse(data);
      data.push({ name, value });
      fs.writeFileSync("./data/faculty.json", JSON.stringify(data));
      return Promise.resolve()
    } catch (error) {
      return Promise.reject('Fail')
    }
  },
};
