const xml2js = require("xml2js");
const axios = require("axios");

async function pullMedium() {
  const { data: xmlData } = await axios.get(
    "https://medium.com/feed/@towardsdatascience"
  );
  return xml2js.parseStringPromise(xmlData);
}

module.exports = pullMedium;