const gql = require('graphql-tag').default
const FACTORY_ADDRESS = '0x553990F2CBA90272390f62C5BDb1681fFc899675'
const BUNDLE_ID = '1'

const queries = {
  TOKEN_SEARCH: gql`
  query tokens($value: String, $id: String) {
    asSymbol: tokens(where: { symbol_contains: $value }, orderBy: totalLiquidity, orderDirection: desc) {
      id
      symbol
      name
      totalLiquidity
    }
  }
`,
  PAIR_SEARCH: gql`
query pairs($tokens: [Bytes]!, $id: String) {
  as0: pairs(where: { token0_in: $tokens }) {
    id
    token0 {
      id
      symbol
      name
    }
    token1 {
      id
      symbol
      name
    }
  }
  as1: pairs(where: { token1_in: $tokens }) {
    id
    token0 {
      id
      symbol
      name
    }
    token1 {
      id
      symbol
      name
    }
  }
}
`,
  PAIR_CHART: gql`
  query pairDayDatas($pairAddress: Bytes!, $skip: Int!) {
    pairDayDatas(first: 1000, skip: $skip, orderBy: date, orderDirection: asc, where: { pairAddress: $pairAddress }) {
      id
      date
      dailyVolumeToken0
      dailyVolumeToken1
      dailyVolumeUSD
      reserveUSD
    }
  }
`,
  FILTERED_TRANSACTIONS: gql`
  query($allPairs: [Bytes]!) {
    mints(first: 20, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
      }
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      to
      liquidity
      amount0
      amount1
      amountUSD
    }
    burns(first: 20, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
      }
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      sender
      liquidity
      amount0
      amount1
      amountUSD
    }
    swaps(first: 30, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
      }
      id
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
    }
  }
`,
  GET_SWAP_TRANSACTIONS: gql`
  query($pairAddr: Bytes!, $time_to: Int!) {
    swaps(first: 1000, where: {timestamp_lte: $time_to, pair: $pairAddr}, orderBy: timestamp, orderDirection: desc) {
      transaction {
        id
        timestamp
      }
      id
      pair {
        token0 {
          id
          symbol
        }
        token1 {
          id
          symbol
        }
      }
      amount0In
      amount0Out
      amount1In
      amount1Out
      amountUSD
      to
    }
  }
`,
  GET_ORDERS_FROM_BLOCK: gql`
query getOrdersFromBlock($fromBlock: BigInt, $toBlock: BigInt) {
  orders(where:{blockNumber_gte:$fromBlock,blockNumber_lte:$toBlock,status:open}) {
    id
    inputToken
    outputToken
    minReturn
    owner
    secret
    witness
    module
    inputAmount
    createdTxHash
  }
}
`,

}

module.exports = function () {
  return queries;
};