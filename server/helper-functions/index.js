const downloadAndWriteFile = require("./downloadAndWriteFile");
const fetchHouseStockDataFileKeys = require("./fetchHouseStockDataFileKeys");
const lowercaseAllObjectKeys = require("./lowercaseAllObjectKeys");
const lowercaseFirstLetter = require("./lowercaseFirstLetter");
const parseXMLtoJSON = require("./parseXMLtoJSON");
const filterDataFileKeysByDate = require("./filterDataFileKeysByDate");
const bulkFetchHouseTradingData = require("./bulkFetchHouseTradingData");
const analyzeFinancialDisclosureData = require("./analyzeFinancialDisclosureData");
const amountScheduling = require("./amountScheduling");

module.exports = {
    downloadAndWriteFile,
    fetchHouseStockDataFileKeys,
    lowercaseAllObjectKeys,
    lowercaseFirstLetter,
    parseXMLtoJSON,
    filterDataFileKeysByDate,
    bulkFetchHouseTradingData,
    analyzeFinancialDisclosureData,
    amountScheduling,
};
