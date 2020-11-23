const { client } = require('./apollo/client')
const queries = require('./apollo/queries')()
const colors = require('colors');
const k_functions = require('./k_functions')();

const customRanger = {
    getMarketId: function (streams) {
        let marketID = "";
        for (let k = 0; k < streams.length; k++) {
            let item = streams[k];
            if (item.indexOf(".trades") > -1) marketID = item.replace(".trades", "");
        }
        return marketID;
    },
    getKLineParams: function (streams) {
        let pairAddress = "", period = 15;
        for (let k = 0; k < streams.length; k++) {
            let item = streams[k];
            if (item.indexOf(".kline-") > -1) {
                let itemSplits = item.split(".");
                if (itemSplits.length < 2) break;
                pairAddress = itemSplits[0];
                switch (itemSplits[1]) {
                    case "kline-1m":
                        period = 1;
                        break;
                    case "kline-5m":
                        period = 5;
                        break;
                    case "kline-15m":
                        period = 15;
                        break;
                    case "kline-30m":
                        period = 30;
                        break;
                    case "kline-1h":
                        period = 60;
                        break;
                    case "kline-2h":
                        period = 120;
                        break;
                    case "kline-4h":
                        period = 240;
                        break;
                    case "kline-6h":
                        period = 360;
                        break;
                    case "kline-12h":
                        period = 720;
                        break;
                    case "kline-1d":
                        period = 1440;
                        break;
                    case "kline-3d":
                        period = 4320;
                        break;
                    default:
                        break;
                }
                break;
            }
        }
        return [pairAddress, period];
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
        data.sort(k_functions.compareTimestampDecent);  // decent
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
            tmpData.sort(k_functions.comparePriceDecent);  // decnet
            ticker[pairAddress].high = tmpData[0].price;
            ticker[pairAddress].low = tmpData[tmpData.length - 1].price;
        }
        return ticker;
    },
    getChartTrades: async function (pairAddress, period) {
        console.log(" === getChartTrades === ".magenta);
        if (!pairAddress) return [];
        const transactions = {}
        let skip = 0; let count = 100;
        if (period > 300) count = 1000;
        else count = period * 3;
        try {
            let result = await client.query({
                query: queries.GET_SWAP_TRANSACTIONS,
                variables: {
                    allPairs: [pairAddress],
                    count,
                    skip
                },
                fetchPolicy: 'no-cache'
            })
            transactions.swaps = result.data.swaps;
        } catch (e) {
            console.log("Transaction GraghQL error:".red, e);
            transactions = [];
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
        // console.log("Swap Transaction: ", transactions.swaps.length);
        data.sort(k_functions.compareTimestampDecent); // decent
        let currentTime = new Date();
        let time_to = parseInt(currentTime.getTime() / 1000);
        let time_from = parseInt((currentTime - 1000 * 60 * period) / 1000);
        let periodData = [];
        let startIndex = 0;
        for (let i = 0; i < data.length; i++) {
            if (data[i].timestamp < time_from) break;
            if (data[i].timestamp >= time_from && data[i].timestamp <= time_to) {
                periodData.push(data[i]);
                startIndex++;
            }
        }
        if (data.length > (startIndex + 1)) periodData.push(data[startIndex]);
        let chartData = [];
        if (periodData.length > 0) {
            let chart_item = [1605968100, 0.0, 0.0, 0.0, 0.0, 0.0]; // timestamp, open, high, low, close, volume
            chart_item[0] = time_to;
            chart_item[1] = periodData[periodData.length - 1].price;
            chart_item[4] = periodData[0].price;
            for (let j = 0; j < periodData.length; j++) {
                chart_item[5] += periodData[j].amount;
            }
            periodData.sort(k_functions.comparePriceAccent);  // accent
            chart_item[2] = periodData[periodData.length - 1].price;
            chart_item[3] = periodData[0].price;
            chartData = chart_item;
        }
        return chartData;
    },
};

module.exports = function () {
    return customRanger;
};