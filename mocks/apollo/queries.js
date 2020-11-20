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
    asName: tokens(where: { name_contains: $value }, orderBy: totalLiquidity, orderDirection: desc) {
      id
      symbol
      name
      totalLiquidity
    }
    asAddress: tokens(where: { id: $id }, orderBy: totalLiquidity, orderDirection: desc) {
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
  asAddress: pairs(where: { id: $id }) {
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

}

module.exports = function () {
  return queries;
};