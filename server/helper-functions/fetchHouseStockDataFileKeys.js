const axios = require("axios");

module.exports = fetchHouseStockDataFileKeys = async () => {
    try {
        const { data: xmlMapping } = await axios.get(
            "https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/filemap.xml",
        );

        const {
            listBucketFileMap: { contents: houseStockDataFileKeys },
        } = lowercaseAllObjectKeys(parseXMLtoJSON(xmlMapping));

        return houseStockDataFileKeys;
    } catch (err) {
        console.error(err);
    }
};
