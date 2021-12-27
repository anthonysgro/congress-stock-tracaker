const express = require("express");
const router = express.Router();
const JSZip = require("jszip");
const axios = require("axios");
const crawler = require("crawler-request");
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

router.get("/", async (req, res, next) => {
    try {
        const CONGRESSIONAL_STOCK_DISCLOSURES_URL =
            "https://disclosures-clerk.house.gov/public_disc/financial-pdfs/2021FD.ZIP";

        const PERIODIC_TRANSACTION_REPORT_URL_TEMPLATE =
            "https://disclosures-clerk.house.gov/public_disc/ptr-pdfs/2021/";

        // Fetch Congressional Stock Disclosures zip file
        const { data: congressionalStockDisclosureZipFile } = await axios.get(
            CONGRESSIONAL_STOCK_DISCLOSURES_URL,
            {
                responseType: "arraybuffer",
            },
        );

        // Parse the zip file and extract text
        const zipParser = new JSZip();
        const congressionalStockDisclosuresRawText = await zipParser
            .loadAsync(congressionalStockDisclosureZipFile)
            .then((zip) => zip.file("2021FD.txt").async("string"));

        // Get the keys for our congressperson objects
        const dataKeys = congressionalStockDisclosuresRawText
            .split("\n")[0]
            .split(/[\t,\r]+/)
            .map((key) => key.charAt(0).toLowerCase() + key.slice(1));

        // Turn all the congress members in the file into objects
        const congressionalStockDisclosuresArray =
            congressionalStockDisclosuresRawText
                .split("\n")
                .map((line) => {
                    const lineData = line.split("\t");

                    // Convert each line to an object
                    return lineData.reduce((acc, cur, i) => {
                        // We are removing the "\r" char at the end of the DocId
                        acc[dataKeys[i]] =
                            dataKeys[i] === "docID" ? cur.split("\r")[0] : cur;

                        return acc;
                    }, {});
                })
                // Find Nancy
                .filter(
                    ({ last, first }) => first === "Nancy" && last === "Pelosi",
                )
                // Get the report for each documentId
                .forEach(async (target) => {
                    console.log("\n");
                    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                    console.log("\n");

                    const periodicTransactionReportUrl = `${
                        PERIODIC_TRANSACTION_REPORT_URL_TEMPLATE +
                        target.docID +
                        ".pdf"
                    }`;

                    console.log(periodicTransactionReportUrl);

                    const loadingTask = await pdfjsLib.getDocument(
                        periodicTransactionReportUrl,
                    );

                    loadingTask.promise.then((doc) => {
                        const numPages = doc.numPages;
                        console.log("# Document Loaded");
                        console.log("Number of Pages: " + numPages);
                        console.log();

                        let lastPromise; // will be used to chain promises
                        lastPromise = doc.getMetadata().then(function (data) {
                            console.log("# Metadata Is Loaded");
                            console.log("## Info");
                            console.log(JSON.stringify(data.info, null, 2));
                            console.log();
                            if (data.metadata) {
                                console.log("## Metadata");
                                console.log(
                                    JSON.stringify(
                                        data.metadata.getAll(),
                                        null,
                                        2,
                                    ),
                                );
                                console.log();
                            }
                        });

                        const loadPage = function (pageNum) {
                            return doc.getPage(pageNum).then(function (page) {
                                console.log("# Page " + pageNum);
                                const viewport = page.getViewport({
                                    scale: 1.0,
                                });
                                console.log(
                                    "Size: " +
                                        viewport.width +
                                        "x" +
                                        viewport.height,
                                );
                                console.log();
                                return page
                                    .getTextContent()
                                    .then(function (content) {
                                        // Content contains lots of information about the text layout and
                                        // styles, but we need only strings at the moment
                                        const strings = content.items.map(
                                            function (item) {
                                                return item.str;
                                            },
                                        );
                                        console.log("## Text Content");
                                        console.log(strings.join(" "));
                                        // Release page resources.
                                        page.cleanup();
                                    })
                                    .then(function () {
                                        console.log();
                                    });
                            });
                        };

                        // Loading of the first page will wait on metadata and subsequent loadings
                        // will wait on the previous pages.
                        for (let i = 1; i <= numPages; i++) {
                            lastPromise = lastPromise.then(
                                loadPage.bind(null, i),
                            );
                        }

                        return lastPromise;
                    });

                    // console.log(loadingTask);

                    // crawler(periodicTransactionReportUrl).then((response) => {
                    //     // handle response
                    //     console.log(response.text);
                    // });

                    // const { data: periodTransactionReportPdfFile } =
                    //     await axios.get(
                    //         `${
                    //             PERIODIC_TRANSACTION_REPORT_URL +
                    //             target.docID +
                    //             ".pdf"
                    //         }`,
                    //         {
                    //             responseType: "arraybuffer",
                    //         },
                    //     );

                    // console.log(periodTransactionReportPdfFile);
                });

        // console.log(congressionalStockDisclosuresArray);

        res.send({ hi: "yay" });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
