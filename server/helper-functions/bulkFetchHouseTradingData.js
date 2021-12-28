const axios = require("axios");

module.exports = bulkFetchHouseTradingData = async (stockDataFileKeys) => {
    try {
        const stockDataFiles = (
            await Promise.all(
                stockDataFileKeys.map(({ key }) =>
                    axios.get(
                        `https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/${key}`,
                    ),
                ),
            )
        ).map((response, i) => {
            return { key: stockDataFileKeys[i], data: response.data };
        });

        return stockDataFiles;
    } catch (err) {
        console.error(err);
    }
};
