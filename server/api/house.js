const express = require("express");
const router = express.Router();
const axios = require("axios");
const date = require("date-and-time");
const { badSyntax } = require("../errors");
const {
    lowercaseAllObjectKeys,
    parseXMLtoJSON,
    fetchHouseStockDataFileKeys,
    filterDataFileKeysByDate,
    bulkFetchHouseTradingData,
    analyzeFinancialDisclosureData,
} = require("../helper-functions");

router.get("/", async (req, res, next) => {
    try {
        const houseStockDataFileKeys = await fetchHouseStockDataFileKeys();
        res.status(200).send(houseStockDataFileKeys);
    } catch (err) {
        next(err);
    }
});

router.get("/date/lastmonth", async (req, res, next) => {
    try {
        const houseStockDataFileKeys = await fetchHouseStockDataFileKeys();

        const startDate = new Date();
        const endDate = date.addMonths(startDate, -1);

        const stockDataFileKeys = filterDataFileKeysByDate(
            houseStockDataFileKeys,
            startDate,
            endDate,
        );

        const stockDataFiles = await bulkFetchHouseTradingData(
            stockDataFileKeys,
        );

        const stocksTraded = analyzeFinancialDisclosureData(stockDataFiles);

        res.send(stocksTraded);
    } catch (err) {
        next(err);
    }
});

router.get("/date", async (req, res, next) => {
    try {
        const houseStockDataFileKeys = await fetchHouseStockDataFileKeys();

        const month = parseInt(req.query.month);
        const year = parseInt(req.query.year);
        const day = req.query.day ? parseInt(req.query.day) : 0;

        const thisYear = new Date().getFullYear();
        const startDate = new Date(year, month - 1, day);
        const endDate = new Date(year, month - 2, day);

        // Validate input
        if (!month || !year) throw badSyntax("Provide a year and month.");
        if (month > 12 || month < 1) throw badSyntax("Invalid month.");
        if (year > thisYear || year < 2020) throw badSyntax("Invalid year.");

        // Fetch data file keys for the month in question
        const stockDataFileKeys = filterDataFileKeysByDate(
            houseStockDataFileKeys,
            startDate,
            endDate,
        );

        // Fetch the actual trading data
        const stockDataFiles = await bulkFetchHouseTradingData(
            stockDataFileKeys,
        );

        res.status(200).send(stockDataFiles);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
