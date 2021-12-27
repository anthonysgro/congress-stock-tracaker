const express = require("express");
const router = express.Router();
const nancyAPI = require("./nancy");
const s3exAPI = require("./s3ex");

router.use("/nancy", nancyAPI);
router.use("/s3ex", s3exAPI);

module.exports = router;
