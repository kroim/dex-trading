const { skipPartiallyEmittedExpressions } = require('typescript');
const { client } = require('./apollo/client')
const queries = require('./apollo/queries')()
const k_functions = require('./k_functions')();
const stableTokens = ['USDT', 'USDC', 'BUSD', 'DAI', 'BNB']
const apiConfig = {
  balances: "/api/v2/peatio/account/balances",
  tickers: "/api/v2/peatio/public/markets/tickers",
  markets: "/api/v2/finex/public/markets",
  currencies: "/api/v2/peatio/public/currencies",
  k_query: async function (pathParam, queryParam) {
    if (pathParam == this.markets) {
      console.log(" ===== Get Markets ===== ".magenta)
      return await this.k_markets();
      // return this.k_sampleMarkets();
    } else if (pathParam == this.tickers) {
      console.log(" ===== Get Ticker Data ===== ".magenta);
      return {};
      // return this.k_sampleTickers();
    } else if (this.k_findTrade(pathParam) == 'trades') {
      console.log(" ===== Get Trade Data ===== ".magenta);
      return await this.k_trades(pathParam, queryParam);
    } else if (this.k_findTrade(pathParam) == 'k-line') {
      console.log(" ===== Get K Line Data ===== ".magenta);
      console.log("ChartURL: ".red, pathParam, ", ", queryParam);
      let currentTime = new Date();
      let period = 15;
      let time_to = parseInt(currentTime.getTime() / 1000);
      let time_from = parseInt((currentTime - 1000 * 60 * 60 * 24 * 1) / 1000);
      if (queryParam) {
        let querySplits = queryParam.split("&");
        for (let i = 0; i < querySplits.length; i++) {
          let queryItem = querySplits[i];
          if (queryItem.indexOf("period=") > -1) {
            period = parseInt(queryItem.replace("period=", ""));
          }
          if (queryItem.indexOf("time_from=") > -1) {
            time_from = parseInt(queryItem.replace("time_from=", ""));
          }
          if (queryItem.indexOf("time_to=") > -1) {
            time_to = parseInt(queryItem.replace("time_to=", ""));
          }
        }
      }
      return await this.k_charts(pathParam, period, time_from, time_to);
      // return this.k_sampleChartHistory()
    }
  },
  k_markets: async function () {
    let value = ''
    let tokens = await client.query({
      query: queries.TOKEN_SEARCH,
      variables: {
        value: value ? value.toUpperCase() : '',
        id: value
      }
    });
    // console.log(tokens.data.asSymbol);
    let pairs = await client.query({
      query: queries.PAIR_SEARCH,
      variables: {
        tokens: tokens.data.asSymbol ? tokens.data.asSymbol.map(t => t.id) : [],
        id: value
      }
    })
    // let allPairs = pairs.data.as0.concat(pairs.data.as1).concat(pairs.data.asAddress);
    let allPairs = pairs.data.as0;
    // console.log("allPairs: ".red, allPairs);
    let d_markets = [];
    for (let i = 0; i < allPairs.length; i++) {
      let item = {
        "id": "btcusd",
        "name": "BTC/USD",
        "base_unit": "btc",
        "quote_unit": "usd",
        "base_contract": "",
        "quote_contract": "",
        "state": "enabled",
        "amount_precision": 3,
        "price_precision": 6,
        "min_price": "0.000001",
        "max_price": "0",
        "min_amount": "0.001",
        "filters": [
          {
            "rules": [
              {
                "limit": "1",
                "step": "0.01"
              },
              {
                "limit": "10",
                "step": "0.1"
              },
              {
                "limit": "100",
                "step": "1"
              },
              {
                "limit": "1000",
                "step": "10"
              },
              {
                "limit": "0",
                "step": "100"
              }
            ],
            "type": "custom_price_steps"
          }
        ]
      }
      item.id = allPairs[i].id;
      let token0 = allPairs[i].token0.symbol;
      let token0_contract = allPairs[i].token0.id;
      if (token0 == 'WBNB') token0 = 'BNB';
      let token1 = allPairs[i].token1.symbol;
      let token1_contract = allPairs[i].token1.id;
      if (token1 == 'WBNB') token1 = 'BNB';
      if (stableTokens.indexOf(token0) > -1) {
        item.name = token0 + "/" + token1;
        item.base_unit = token0.toLowerCase();
        item.base_contract = token0_contract;
        item.quote_unit = token1.toLowerCase();
        item.quote_contract = token1_contract;
      } else {
        item.name = token1 + '/' + token0;
        item.base_unit = token1.toLowerCase();
        item.base_contract = token1_contract;
        item.quote_unit = token0.toLowerCase();
        item.quote_contract = token0_contract;
      }
      // item.id = item.base_unit.toLowerCase() + item.quote_unit.toLowerCase();
      d_markets.push(item);
    }
    // return this.k_sampleData()
    // console.log(d_markets);
    let tokenOrderList = ['BNB', 'BUSD', 'JULB', 'OBRB', 'SWGB'];
    let firstList = [null, null, null, null, null];
    let secondList = [];
    for (let i = 0; i < d_markets.length; i++) {
      let tokenIndex = tokenOrderList.indexOf(d_markets[i].quote_unit.toUpperCase());
      if (tokenIndex > -1 && !firstList[tokenIndex]) {
        firstList[tokenOrderList.indexOf(d_markets[i].quote_unit.toUpperCase())] = d_markets[i];
      } else secondList.push(d_markets[i]);
    }
    firstList = firstList.filter(function (el) { return el });
    let marketList = firstList.concat(secondList);
    // console.log("marketList: ", marketList);
    return marketList
  },
  k_trades: async function (pathParam, queryParam) {
    let pairAddress = pathParam.match(new RegExp("markets/" + "(.*)" + "/trades"))[1];
    console.log("pairAddress: ".red, pairAddress.green);
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
      let trade_item = { id: 492221222, price: 2.418e-05, amount: 20.1, total: 0.000486018, market: "dashbtc", created_at: 1597321400, taker_type: "buy" };
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
    // console.log(" --- Transactions --- ");
    // console.log(data);
    return data;
  },
  k_charts: async function (pathParam, period, time_from, time_to) {
    let pairAddress = pathParam.match(new RegExp("markets/" + "(.*)" + "/k-line"))[1];
    console.log(pairAddress.green, period, time_from, time_to);
    const transactions = {}
    let skip = 0; let count = 1000;
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
      // transactions.mints = result.data.mints
      // transactions.burns = result.data.burns
      transactions.swaps = result.data.swaps;
    } catch (e) {
      console.log("Transaction GraghQL error:".red, e);
      transactions.swaps = [];
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
    data.sort(k_functions.compareTimestampAccent); // accent
    // console.log("Data: ", data);
    let chartData = [];
    if (data.length > 0 && data[0].timestamp > time_to) {
      console.log("   === No Data ===   ".red);
      return { no_data: true, nextTime: time_to };
    }
    let currentPeriod = time_from;
    let nextPeriod = time_from + period * 60;
    let periodData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].timestamp > time_to) break;
      if (data[i].timestamp > nextPeriod) {
        currentPeriod = nextPeriod;
        nextPeriod = nextPeriod + period * 60;
        if (periodData.length > 0) {
          let chart_item = [1605968100, 0.0, 0.0, 0.0, 0.0, 0.0]; // timestamp, open, high, low, close, volume
          chart_item[0] = currentPeriod;
          chart_item[1] = periodData[0].price;
          chart_item[4] = periodData[periodData.length - 1].price;
          for (let j = 0; j < periodData.length; j++) {
            chart_item[5] += periodData[j].amount;
          }
          periodData.sort(k_functions.comparePriceAccent);  // accent
          chart_item[2] = periodData[periodData.length - 1].price;
          chart_item[3] = periodData[0].price;
          chartData.push(chart_item);
        }
        periodData = [];
        if (i > 0) periodData.push(data[i - 1]);
      }
      periodData.push(data[i]);
    }
    // console.log("chartData: ".red, chartData);
    // return [];
    return chartData;
  },
  k_urls: function () {
    return [
      this.markets,
      this.tickers
    ]
  },
  k_findTrade: function (urlPath) {
    if (urlPath.match(new RegExp("markets/" + "(.*)" + "/trades"))) {
      return "trades";
      // return null;
    } else if (urlPath.match(new RegExp("markets/" + "(.*)" + "/k-line"))) {
      return "k-line";
      // return null;
    } else return null;
  },
  k_sampleMarkets: function () {
    return [
      {
        "id": "dashbtc",
        "name": "DASH/BTC",
        "base_unit": "dash",
        "quote_unit": "btc",
        "state": "enabled",
        "amount_precision": 3,
        "price_precision": 6,
        "min_price": "0.000001",
        "max_price": "0",
        "min_amount": "0.001",
        "filters": [
          {
            "digits": 5,
            "type": "significant_digits"
          }
        ]
      },
      {
        "id": "ethbtc",
        "name": "ETH/BTC",
        "base_unit": "eth",
        "quote_unit": "btc",
        "state": "enabled",
        "amount_precision": 5,
        "price_precision": 7,
        "min_price": "0.0000001",
        "max_price": "0",
        "min_amount": "0.00001",
        "filters": [
          {
            "type": "significant_digits",
            "digits": 5
          },
          {
            "type": "custom_price_steps",
            "rules": [
              {
                "limit": "10",
                "step": "0.01"
              },
              {
                "limit": "100",
                "step": "0.1"
              },
              {
                "limit": "1000",
                "step": "1"
              },
              {
                "limit": "10000",
                "step": "5"
              },
              {
                "limit": "100000",
                "step": "10"
              },
              {
                "limit": "0",
                "step": "1000"
              }
            ]
          }
        ]
      },
      {
        "id": "btcusd",
        "name": "BTC/USD",
        "base_unit": "btc",
        "quote_unit": "usd",
        "state": "enabled",
        "amount_precision": 7,
        "price_precision": 2,
        "min_price": "0.01",
        "max_price": "0",
        "min_amount": "0.0000001",
        "filters": [
          {
            "rules": [
              {
                "limit": "1",
                "step": "0.01"
              },
              {
                "limit": "10",
                "step": "0.1"
              },
              {
                "limit": "100",
                "step": "1"
              },
              {
                "limit": "1000",
                "step": "10"
              },
              {
                "limit": "0",
                "step": "100"
              }
            ],
            "type": "custom_price_steps"
          }
        ]
      }
    ]
  },
  k_sampleTickers: function () {
    let ts = parseInt(Date.now() / 1000);
    return {
      "ethbtc": {
        "at": ts,
        "ticker": {
          "amount": "124.021",
          "buy": "0.240",
          "sell": "0.250",
          "low": "0.238",
          "high": "0.253",
          "last": "0.245",
          "volume": "200.0",
          "open": 0.247,
          "price_change_percent": "+0.81%"
        }
      },
      "dashbtc": {
        "at": ts,
        "ticker": {
          "amount": "23.0",
          "buy": "1.20",
          "sell": "1.30",
          "low": "1.15",
          "high": "1.35",
          "last": "1.250",
          "volume": "50.0",
          "open": 1.250,
          "price_change_percent": "+0.00%"
        }
      },
      "btcusd": {
        "at": ts,
        "ticker": {
          "amount": "60.0",
          "buy": "1200.0",
          "sell": "1300.0",
          "low": "1150.0",
          "high": "1350.0",
          "last": "1250.0",
          "volume": "120.0",
          "open": 1251.0,
          "price_change_percent": "+0.08%"
        }
      },
    }
  },
  k_sampleChartHistory: function () {
    return [[1605983400, 541.62, 543.73, 541.1, 543.16, 275.77883101], [1605984300, 543.58, 543.7, 539.71, 540.59, 1166.91212347], [1605985200, 540.67, 544.91, 538.09, 540.48, 2349.7087112299996], [1605986100, 539.89, 540.96, 535.8, 536.48, 16460.68151557998], [1605987000, 536.37, 539.44, 536.14, 539.44, 1282.80401902], [1605987900, 539.43, 541.31, 538.89, 540.37, 706.4661496499998], [1605988800, 540.37, 540.37, 537.01, 537.53, 308.59769624], [1605989700, 537.09, 538.83, 537, 538.42, 435.1958257], [1605990600, 538.43, 539.9, 537.43, 538.68, 260.73702717000003], [1605991500, 538.99, 540.25982683, 538.22, 540.02, 676.56484048], [1605992400, 540.02, 540.21, 535.7187323, 535.73, 1287.5084290599996], [1605993300, 535.73, 538.93188274, 535.66, 538.21, 592.84565377], [1605994200, 538.93188274, 541.71, 538.91, 541.71, 984.50651238], [1605995100, 541.9, 543.68, 541.85, 542, 1690.1517134000003], [1605996000, 542, 542.31, 532.77, 534.17, 8017.2576534400005], [1605996900, 534.16, 537.08, 533.99, 536.4, 1700.2157353899993], [1605997800, 536.4, 539.34, 535.73, 538.57618343, 403.1070669999999], [1605998700, 538.36276384, 541.3914368, 536.28, 541.22, 572.7528324], [1605999600, 541.4, 541.56, 539.55, 540.06, 1379.27630333], [1606000500, 540.23, 541.36, 538.38, 541.35, 333.17287875], [1606001400, 541.36, 548.28, 540.75, 547.1, 2916.146278699998], [1606002300, 547.10111025, 551.69, 545, 551.19, 5114.006077299999], [1606003200, 551.42, 555, 549.39, 554.28, 3818.3382249700003], [1606004100, 554.27, 559.48, 552.23, 557.21, 6901.851140119999], [1606005000, 556.78, 560.14, 554.29, 555.72, 2057.0772141700004], [1606005900, 555.73274686, 556.52, 540.87, 548.77, 5619.413714479994], [1606006800, 548.76, 552.88, 542.23, 544.4, 2585.7712147399993], [1606007700, 544.69421158, 550.38, 541.57, 548.83, 1881.1575775400001], [1606008600, 549.08, 549.08, 535.67, 537.64, 6492.70532743], [1606009500, 537.75, 541.82, 535.16, 540.96, 1772.9316346600006], [1606010400, 541, 544.28, 539.96, 542.46, 611.28022292], [1606011300, 542.05, 545.57, 541.4, 544.72, 393.14297016], [1606012200, 544.63, 547.94, 544.48, 546.48, 432.89724779999995], [1606013100, 546.21, 549.4, 545.05, 547.04, 377.26001463000006], [1606014000, 547.26, 548.03, 544.39, 546.51, 551.1415649500001], [1606014900, 546.67, 547.5, 543.91, 543.96, 368.47260529000005], [1606015800, 544, 547.61, 544, 547.24, 353.32327891], [1606016700, 546.95, 548.44, 545.79, 548.24, 597.48018137], [1606017600, 547.80065223, 548.23934804, 544.06, 544.1, 199.32830244000002], [1606018500, 544.09, 545.84, 542.97, 544.49, 599.4417786500001], [1606019400, 544.74, 547, 544.74, 546.91, 584.58268409], [1606020300, 547, 547.77, 545.14, 546.32, 151.50450208999996], [1606021200, 546.06, 546.12, 544.27, 544.33, 548.0667698100001], [1606022100, 543.95909967, 546.91, 543.95909967, 546.65055779, 257.92103183], [1606023000, 546.75, 546.88, 543.54, 543.7, 277.18036204], [1606023900, 543.54, 543.54, 540.2, 542.32, 1273.39103366], [1606024800, 541.92, 543.44, 539.09, 539.41, 432.34312038999985], [1606025700, 539.39, 541.01, 536.52, 540.73, 875.1225367300001], [1606026600, 540.51, 542.16, 539.26, 541.37, 187.08986435], [1606027500, 541.17, 542.15, 541.01865203, 542.15, 127.35261726], [1606028400, 541.03, 541.03, 537, 537.32, 541.12215452], [1606029300, 537.4, 539.43, 535.7, 535.7, 2875.7698683], [1606030200, 535.7, 537.96, 532.64335312, 537.96, 3315.0111844399967], [1606031100, 537.97, 541.12, 537.55, 540.69, 1750.83287587], [1606032000, 540.66, 540.83, 537.37, 537.54, 260.27237631], [1606032900, 537.73, 537.99520789, 535.22, 536.26, 735.25923768], [1606033800, 536.4, 537.55, 534, 534.01, 502.90668911999995], [1606034700, 534, 537.79, 534, 534.86505361, 957.0979951200001], [1606035600, 534.86, 539.73, 533.18, 538.98, 1730.09631598], [1606036500, 539.09, 539.36, 536.55, 538.69, 826.4143394], [1606037400, 538.47, 543.57, 538.39, 543.56, 1588.5902957500002], [1606038300, 543.57, 544.09, 542.42, 543.18, 323.53451741], [1606039200, 543.15, 543.15, 541.2, 541.54, 338.4552835699998], [1606040100, 541.46, 542.5, 540.3, 540.6, 339.1244120900001], [1606041000, 540.63, 540.63, 535, 537.24823933, 2296.3666926599994], [1606041900, 537.04, 538.93188274, 533.94, 537.62, 3672.2517678399995], [1606042800, 537.57, 538.45, 534.25, 535.75224401, 1569.22373824], [1606043700, 535.85, 537.4, 532.53, 533.2, 2206.1150486700003], [1606044600, 533.2, 533.96, 522.8, 524.77, 14639.560139950063], [1606045500, 524.79, 525.87771803, 512, 522.96, 13040.190083339996], [1606046400, 522.43, 526.74, 520.04, 526.15, 2158.2962717600003], [1606047300, 526.54, 528.7771683, 524, 527.92, 2248.47318461], [1606048200, 527.91, 529.63, 526.01, 528.27, 1876.1347456699996], [1606049100, 527.73921109, 529.88, 526.4, 527.22, 413.11094089000005], [1606050000, 527.19, 527.78, 525.00032639, 525.34, 809.1289525799999], [1606050900, 525.33, 531.79, 524.59, 531.79, 1381.2871305600004], [1606051800, 531.68, 533.55, 530.8, 533.08, 590.0866055299998], [1606052700, 533.2, 534.2, 530.9, 532.5, 416.16551161], [1606053600, 532.49372521, 532.93, 528.65, 532.93, 3058.121236830001], [1606054500, 532.93, 534.6, 531.02, 532.05, 2555.26245571], [1606055400, 531.73, 532.97, 529.52956429, 530.31210277, 398.05049461999994], [1606056300, 529.94, 531.88, 529.01, 529.59, 425.23436965], [1606057200, 529.58, 532.29, 529.55, 531.97, 463.72806033], [1606058100, 532.02, 532.29, 529.26871812, 529.47, 887.0902692300001], [1606059000, 529.81, 532.58, 529.00787196, 532.31, 321.47552182000004], [1606059900, 532.45, 534.09, 530.87, 533.95, 1436.67333079], [1606060800, 533.78609937, 540.86, 532.01945946, 540.86, 2878.7409260100003], [1606061700, 540.86, 546.47, 538.78, 546.42, 2367.3777089700006], [1606062600, 546.48456478, 549.69, 545.4, 548.2, 6136.539873589997], [1606063500, 548, 554.92, 548, 552.32989012, 6317.0927769200025], [1606064400, 552.23, 554.03, 550.33, 553.08, 2129.9038512099996], [1606065300, 553.41, 553.5, 548.04, 552.17, 3094.09960924], [1606066200, 552.1, 552.23, 549.07, 551.37, 1025.08459466], [1606067100, 551.32207541, 554, 549.84, 552.06, 1181.0146828700003], [1606068000, 551.62, 561, 551.62, 559.79, 4183.335229009997], [1606068900, 559.49, 566.9, 558.64, 560.8429603, 11966.905895830001], [1606069800, 560.9, 565.99, 559.6, 563.53441806, 3366.7464493099988], [1606070700, 563.65, 563.65, 561, 561.79, 1095.0566888499998], [1606071600, 561.75, 569.15, 561.75, 565.84, 7789.204910369998], [1606072500, 566.31, 568.06, 564.2, 564.2, 1260.38209469], [1606073400, 564.2, 570.84, 563.78, 570.74, 3503.9991425100006], [1606074300, 570.75, 573.4, 569.86, 572.09, 5473.025694209999], [1606075200, 572.36, 574.22, 567.69, 571.57692827, 5381.038880709997], [1606076100, 571.57, 573.37888647, 564.69, 568.36422185, 3426.5658670899993], [1606077000, 568.66059683, 569.55, 564.32, 566.16, 1115.0034239699999], [1606077900, 566.19, 567.27, 558.46, 566.37, 3226.134337549998], [1606078800, 566.37, 567.42, 562.76, 566.42, 9542.93597821], [1606079700, 566.59, 571.39, 566.59, 570.62, 1433.3605006700004], [1606080600, 570.76635094, 571.23, 568.01, 571.23, 609.9849360499999], [1606081500, 571.32, 574.22, 569.6, 572.34, 510.59307168], [1606082400, 571.77, 573.97, 568.8, 573.41, 1137.2024761], [1606083300, 573.38, 579.29, 573, 577.56, 5915.4261574], [1606084200, 577.53, 579.8, 574.46, 577.69, 3706.0059462800004], [1606085100, 577, 578.49, 571.23, 573.19, 1547.6590459800002], [1606086000, 573.01, 573.26, 560.98, 564.26, 11335.099543590011], [1606086900, 564.19, 567.58122513, 559.90749251, 564.59, 12594.86535737], [1606087800, 564.81, 568.84998992, 564.67, 564.67, 2335.9116679500003], [1606088700, 564.67, 565.28, 554.63, 558, 9380.048968560002], [1606089600, 558, 566.98, 557.86800948, 566.38092354, 6840.750516249998], [1606090500, 566.32159925, 567.98, 556.09, 557.13, 1853.2152317700004], [1606091400, 557.61, 560.04, 552.72, 553.05, 2943.517967630001], [1606092300, 553.05, 556.22, 549.6, 552.01, 4112.22174666], [1606093200, 552.01, 559.8, 549.61, 558.39, 2218.21292627], [1606094100, 558.49, 560, 553.71, 554.38, 1241.88656414], [1606095000, 554.48, 560.04, 553.57, 559.5, 1645.0195003499998], [1606095900, 559.74, 562.49, 559.1, 560.21, 576.2332957899999]]
  },
}

module.exports = function () {
  return apiConfig;
};

