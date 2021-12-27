const express = require("express");
const router = express.Router();
const nancyAPI = require("./nancy");

router.use("/nancy", nancyAPI);

module.exports = router;
