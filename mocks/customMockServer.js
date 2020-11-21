const { client } = require('./apollo/client')
const queries = require('./apollo/queries')()
const stableTokens = ['USDT', 'USDC', 'BUSD', 'DAI', 'BNB']
const apiConfig = {
  balances: "/api/v2/peatio/account/balances",
  tickers: "/api/v2/peatio/public/markets/tickers",
  markets: "/api/v2/finex/public/markets",
  currencies: "/api/v2/peatio/public/currencies",
  k_query: async function (pathParam, queryParam) {
    if (pathParam == this.markets) {
      console.log(" ===== Get Markets ===== ".red)
      return this.k_markets();
      // return this.k_sampleData();
    }
    else if (this.k_findTrade(pathParam)) {
      console.log(" ===== Get Trade Data ===== ".green);
      return this.k_trades(pathParam, queryParam);
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
    let pairs = await client.query({
      query: queries.PAIR_SEARCH,
      variables: {
        tokens: tokens.data.asSymbol ? tokens.data.asSymbol.map(t => t.id) : [],
        id: value
      }
    })
    // let allPairs = pairs.data.as0.concat(pairs.data.as1).concat(pairs.data.asAddress);
    let allPairs = pairs.data.as0;
    let d_markets = [];
    for (let i = 0; i < allPairs.length; i++) {
      let item = {
        "id": "btcusd",
        "name": "BTC/USD",
        "base_unit": "btc",
        "quote_unit": "usd",
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
      // item.id = allPairs[i].id;
      let token0 = allPairs[i].token0.symbol;
      if (token0 == 'WBNB') token0 = 'BNB';
      let token1 = allPairs[i].token1.symbol;
      if (token1 == 'WBNB') token1 = 'BNB';
      if (stableTokens.indexOf(token0) > -1) {
        item.name = token0 + "/" + token1;
        item.base_unit = token0.toLowerCase();
        item.quote_unit = token1.toLowerCase();
      } else {
        item.name = token1 + '/' + token0;
        item.base_unit = token1.toLowerCase();
        item.quote_unit = token0.toLowerCase();
      }
      item.id = item.base_unit.toLowerCase() + item.quote_unit.toLowerCase();
      d_markets.push(item);
    }
    // return this.k_sampleData()
    // console.log(d_markets);
    return d_markets
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
          trade_item.price = parseFloat((parseFloat(item.amount1In)/parseFloat(item.amount0Out)).toFixed(6));
        } catch (e) {
          trade_item.price = 0;
        }
      } else {
        trade_item.taker_type = "buy";
        trade_item.amount = parseFloat(item.amount0In);
        try {
          trade_item.price = parseFloat((parseFloat(item.amount1Out)/parseFloat(item.amount0In)).toFixed(6));
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
  k_tradesWrong: async function (pathParam, queryParam) {
    let pairAddress = pathParam.match(new RegExp("markets/" + "(.*)" + "/trades"))[1];
    console.log("pairAddress: ".red, pairAddress.green);
    let skip = 0;
    let allFound = false;
    let data = []
    while (!allFound) {
      let result = await client.query({
        query: queries.PAIR_CHART,
        variables: {
          pairAddress: pairAddress,
          skip
        },
        fetchPolicy: 'cache-first'
      })
      skip += 1000
      let skip_data = [];
      for (let i = 0; i < result.data.pairDayDatas.length; i++) {
        let skip_item = result.data.pairDayDatas[i];
        let trade_item = { id: 492221222, price: 2.418e-05, amount: 20.1, total: 0.000486018, market: "dashbtc", created_at: 1597321400, taker_type: "buy" };
        trade_item.id = skip_item.id.replace(pairAddress + "-", "");
        trade_item.created_at = skip_item.date;
        if (skip_item.dailyVolumeToken0 == '0' || skip_item.dailyVolumeToken1 == '0') {
          trade_item.amount = 0; trade_item.total = 0; trade_item.market = pairAddress; trade_item.price = 0; trade_item.taker_type = "buy"
        } else {
          trade_item.amount = parseFloat(skip_item.dailyVolumeToken0); trade_item.total = parseFloat(skip_item.dailyVolumeToken1);
          trade_item.price = parseFloat((trade_item.total / trade_item.amount).toFixed(6));
          trade_item.market = pairAddress; trade_item.taker_type = "buy";
        }
        skip_data.push(trade_item);
      }
      data = data.concat(skip_data)
      if (result.data.pairDayDatas.length < 1000) {
        allFound = true
      }
    }
    // console.log("result.data: ".blue, pathParam);
    // console.log(data);
    return data;
  },
  k_urls: function () {
    return [
      this.markets
    ]
  },
  k_findTrade: function (urlPath) {
    if (urlPath.match(new RegExp("markets/" + "(.*)" + "/trades"))) {
      return true;
    } else return false;
  },
  k_sampleData: function () {
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
  }
}

module.exports = function () {
  return apiConfig;
};

