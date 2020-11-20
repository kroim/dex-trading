const { client } = require('./apollo/client')
const queries = require('./apollo/queries')()
const stableTokens = ['USDT', 'USDC', 'BUSD', 'DAI', 'BNB']
const apiConfig = {
  balances: "/api/v2/peatio/account/balances",
  tickers: "/api/v2/peatio/public/markets/tickers",
  markets: "/api/v2/finex/public/markets",
  currencies: "/api/v2/peatio/public/currencies",
  trades: "/api/v2/peatio/public/markets/dashbtc/trades",
  k_query: async function (pathParam, query) {
    if (pathParam == this.markets) {
      console.log(" ===== Get Markets ===== ".red)
      return this.k_markets();
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
    let allPairs = pairs.data.as0.concat(pairs.data.as1).concat(pairs.data.asAddress);
    let d_markets = [];
    for (let i = 0; i < allPairs.length; i++) {
      let item = {
        "id": "btcusd",
        "name": "CUSTOM/USD",
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
      item.id = allPairs[i].id;
      let token0 = allPairs[i].token0.symbol;
      if (token0 == 'WBNB') token0 = 'BNB';
      let token1 = allPairs[i].token1.symbol;
      if (token1 == 'WBNB') token1 = 'BNB';
      if (stableTokens.indexOf(token0) > -1) {
        item.name = token0 + "/" + token1;
        item.base_unit = token0;
        item.quote_unit = token1;
      } else {
        item.name = token1 + '/' + token0;
        item.base_unit = token1;
        item.quote_unit = token0;
      }
      d_markets.push(item);
    }
    // return this.k_sampleData()
    console.log(d_markets);
    return d_markets
  },
  k_urls: function () {
    return [
      this.markets
    ]
  },
  k_sampleData: function () {
    return [
      {
        "id": "dashbtc",
        "name": "DASH/CUSTOM",
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
        "name": "ETH/Custom",
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
        "name": "CUSTOM/USD",
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

