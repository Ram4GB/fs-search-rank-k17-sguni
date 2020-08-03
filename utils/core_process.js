const fs = require("fs");
const { callRequest } = require("../utils/math");
const util = require("util");

// const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);
const pathFaculty = "./data/faculty.json";

module.exports = {
  algorithm: async ({ firstId, total, name, value, datetimeRequest, id }) => {
    // create new file in data
    await callRequest(parseInt(firstId), parseInt(total), value);
    // create new faculty
    try {
      let data = await readFileAsync("./data/faculty.json");
      data = JSON.parse(data);
      data.push({ firstId, total, name, value, datetimeRequest, id });
      fs.writeFileSync("./data/faculty.json", JSON.stringify(data));
      console.log("Write file ", name, "done");
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  },
  pathFaculty,
};
