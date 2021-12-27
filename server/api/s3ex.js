const express = require("express");
const router = express.Router();

// AWS Dependencies
const { S3Client } = require("@aws-sdk/client-s3");

// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"

router.get("/", async (req, res, next) => {
    try {
    } catch (err) {
        next(err);
    }
});

module.exports = router;
