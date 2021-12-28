const amountScheduling = require("./amountScheduling");

module.exports = analyzeFinancialDisclosureData = (stockDataFiles) => {
    const allFinancialTransactionsInPeriod = stockDataFiles.reduce(
        (acc, cur) => {
            const listOfFinancialDisclosuresOnDay = cur.data;

            for (const {
                transactions,
                name,
                filing_date,
                source_ptr_link,
            } of listOfFinancialDisclosuresOnDay) {
                transactions.forEach((transaction) => {
                    const entry = { stockTicker: "", sale: {} };

                    const { description, ticker, transaction_type, amount } =
                        transaction;

                    const details = {
                        name,
                        filing_date,
                        description,
                        amount,
                        source_ptr_link,
                    };

                    entry.stockTicker = ticker;
                    entry.sale = {
                        saleType: transaction_type,
                        estimatedAmount: amountScheduling.avg[amount],
                        pointValue: amountScheduling.points[amount],
                        details: {
                            ...details,
                        },
                    };

                    acc.push(entry);
                });
            }

            // const acc;
            return acc;
        },
        [],
    );

    const aggregatedFinancialDisclosures = {};
    for (const transaction of allFinancialTransactionsInPeriod) {
        const { stockTicker, sale } = transaction;

        if (aggregatedFinancialDisclosures.hasOwnProperty(stockTicker)) {
            aggregatedFinancialDisclosures[stockTicker].activityScore +=
                sale.pointValue;

            aggregatedFinancialDisclosures[stockTicker].sales[
                sale.saleType
            ].push(sale);
        } else {
            aggregatedFinancialDisclosures[stockTicker] = {
                activityScore: sale.pointValue,
                sales: { purchase: [], sale_full: [], sale_partial: [] },
            };

            aggregatedFinancialDisclosures[stockTicker].sales[sale.saleType] = [
                sale,
            ];
        }
    }

    // console.log(Object.entries(aggregatedFinancialDisclosures));
    const listOfTradedStocks = [];
    for (const [stockTicker, aggregatedStats] of Object.entries(
        aggregatedFinancialDisclosures,
    )) {
        listOfTradedStocks.push({ stock: stockTicker, ...aggregatedStats });
    }

    return listOfTradedStocks.sort((a, b) => b.activityScore - a.activityScore);
};
