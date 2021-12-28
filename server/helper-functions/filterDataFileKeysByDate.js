const date = require("date-and-time");

module.exports = filterDataFileKeysByDate = (
    houseStockDataFileKeys,
    startDate,
    endDate,
) => {
    return houseStockDataFileKeys.filter(({ key }) => {
        const [, , , keyMonth, keyDay, keyYear] = key.split(/["_","."]+/);

        const keyDate = date.parse(
            keyMonth + "/" + keyDay + "/" + keyYear,
            "MM/DD/YYYY",
        );

        return keyDate >= endDate && keyDate <= startDate;
    });
};
