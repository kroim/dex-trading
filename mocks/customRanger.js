const { client } = require('./apollo/client')
const queries = require('./apollo/queries')()
const colors = require('colors');

const customRanger = {
    compareTimestamp: function (a, b) {
        if (a.timestamp < b.timestamp) return 1;
        if (a.timestamp > b.timestamp) return -1;
        return 0;
    },
    comparePrice: function (a, b) {
        if (a.price < b.price) return 1;
        if (a.price > b.price) return -1;
        return 0;
    },
    getMarketId: function (streams) {
        let marketID = "";
        for (let k = 0; k < streams.length; k++) {
            let item = streams[k];
            if (item.indexOf(".trades") > -1) marketID = item.replace(".trades", "");
        }
        return marketID;
    },
    replaceTickerId: function (marketId, streams) {
        let res_streams = [];
        if (marketId == "") return streams;
        for (let i = 0; i < streams.length; i++) {
            let item = streams[i];
            if (item.indexOf(".tickers") > -1) {
                let replaceTicker = marketId + ".tickers";
                res_streams.push(replaceTicker);
            }
            else res_streams.push(item)
        }
        return res_streams;
    },
    getTikcer: async function (pairAddress) {
        console.log(" === getTicker === ".magenta);
        const transactions = {}
        try {
            let result = await client.query({
                query: queries.FILTERED_TRANSACTIONS,
                variables: {
                    allPairs: [pairAddress]
                },
                fetchPolicy: 'no-cache'
            })
            transactions.mints = result.data.mints
            transactions.burns = result.data.burns
            transactions.swaps = result.data.swaps
        } catch (e) {
            console.log("Transaction GraghQL error:".red, e);
        }
        let currentTime = new Date();
        let currentTimeStamp = parseInt(currentTime.getTime() / 1000);
        let yesterdayTimeStamp = parseInt((currentTime - 1000 * 60 * 60 * 24 * 1) / 1000);
        // console.log("yesterdayTimeStamp: ".magenta, yesterdayTimeStamp);
        // console.log("currentTimeStamp: ".magenta, currentTimeStamp);
        let ticker = {};
        ticker[pairAddress] = {
            "amount": "0.0",
            "low": "0.0",
            "high": "0.0",
            "last": "0.0",
            "open": "0.0",
            "volume": "0.0",
            "avg_price": "0.0",
            "price_change_percent": "+0.00%",
            "at": currentTimeStamp,
        }
        let data = [];
        for (let k = 0; k < transactions.swaps.length; k++) {
            let item = transactions.swaps[k];
            let dataItem = { amount: 0, price: 0, timestamp: parseInt(item.transaction.timestamp) };
            if (item.amount0In == "0") {
                dataItem.amount = parseFloat(item.amount0Out);
                try {
                    dataItem.price = parseFloat((parseFloat(item.amount1In) / parseFloat(item.amount0Out)).toFixed(6));
                } catch (e) {
                    dataItem.price = 0;
                }
            } else {
                dataItem.amount = parseFloat(item.amount0In);
                try {
                    dataItem.price = parseFloat((parseFloat(item.amount1Out) / parseFloat(item.amount0In)).toFixed(6));
                } catch (e) {
                    dataItem.price = 0;
                }
            }
            data.push(dataItem);
        }
        data.sort(this.compareTimestamp);
        // console.log("CompareTimestamp: ", data);
        let tmpData = [];
        let volume = 0, sum_price = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].timestamp >= yesterdayTimeStamp) {
                if (i == 0) {
                    ticker[pairAddress].amount = data[i].amount;
                    ticker[pairAddress].open = ticker[pairAddress].last = data[i].price;
                }
                volume += data[i].amount;
                sum_price += data[i].price;
                tmpData.push(data[i]);
            }
            else break;
        }
        ticker[pairAddress].volume = volume;
        if (tmpData.length > 0) {
            ticker[pairAddress].avg_price = (sum_price / tmpData.length).toFixed(6);
            let price_change_percent = (tmpData[tmpData.length - 1].price - tmpData[0].price) * 100;
            if (price_change_percent < 0) ticker[pairAddress].price_change_percent = price_change_percent.toFixed(2) + "%";
            else ticker[pairAddress].price_change_percent = "+" + price_change_percent.toFixed(2) + "%";
            tmpData.sort(this.comparePrice);
            ticker[pairAddress].high = tmpData[0].price;
            ticker[pairAddress].low = tmpData[tmpData.length - 1].price;
        }
        return ticker;
    },
    getChartTrades: async function (pairAddress) {
        const transactions = {}
        try {
            let result = await client.query({
                query: queries.FILTERED_TRANSACTIONS,
                variables: {
                    allPairs: [pairAddress]
                },
                fetchPolicy: 'no-cache'
            })
            transactions.mints = result.data.mints
            transactions.burns = result.data.burns
            transactions.swaps = result.data.swaps
        } catch (e) {
            console.log("Transaction GraghQL error:".red, e);
        }
        let data = [];
        for (let k = 0; k < transactions.swaps.length; k++) {
            let item = transactions.swaps[k];
            trade_item.id = item.id; trade_item.created_at = parseInt(item.transaction.timestamp);
            trade_item.total = parseFloat(item.amountUSD); trade_item.market = pairAddress;
            if (item.amount0In == "0") {
                trade_item.taker_type = "sell";
                trade_item.amount = parseFloat(item.amount0Out);
                try {
                    trade_item.price = parseFloat((parseFloat(item.amount1In) / parseFloat(item.amount0Out)).toFixed(6));
                } catch (e) {
                    trade_item.price = 0;
                }
            } else {
                trade_item.taker_type = "buy";
                trade_item.amount = parseFloat(item.amount0In);
                try {
                    trade_item.price = parseFloat((parseFloat(item.amount1Out) / parseFloat(item.amount0In)).toFixed(6));
                } catch (e) {
                    trade_item.price = 0;
                }
            }
            data.push(trade_item);
        }
    },
};

module.exports = function () {
    return customRanger;
};