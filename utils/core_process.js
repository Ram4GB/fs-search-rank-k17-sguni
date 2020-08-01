const fs = require('fs')
const { callRequest } = require("../utils/math");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

module.exports = {
  algorithm: async ({firstId, total, name, value}) => {
    // create new file in data
    await callRequest(parseInt(firstId), parseInt(total), value);
    // create new faculty
    try {
      let data = await readFileAsync("./data/faculty.json");
      data = JSON.parse(data);
      data.push({ name, value });
      fs.writeFile("./data/faculty.json", JSON.stringify(data), (err) => {console.log(`write ${name} done`, err)});
    } catch (error) {
      console.log(error)
    }
  },
};
