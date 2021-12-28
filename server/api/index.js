const express = require("express");
const router = express.Router();
const nancyAPI = require("./nancy");
const house = require("./house");

router.use("/nancy", nancyAPI);
router.use("/house", house);

module.exports = router;
