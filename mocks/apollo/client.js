let fetch = require('node-fetch')
let ApolloClient = require('apollo-client').default;
let {InMemoryCache} = require('apollo-cache-inmemory');
let {HttpLink} = require('apollo-link-http');

const client = new ApolloClient({
  link: new HttpLink({
    // uri: 'https://subgraph.bscswap.com/subgraphs/name/bscswap/bscswap-subgraph'
    uri: 'https://subgraph.swapliquidity.org/subgraphs/name/swapliquidity/subgraph',
    fetch: fetch
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

const healthClient = new ApolloClient({
  link: new HttpLink({
    // uri: 'http://95.179.137.89:8000/index-node/graphql'
    uri: 'https://subgraph.bscswap.com/index-node/graphql',
    fetch: fetch
  }),
  cache: new InMemoryCache(),
  shouldBatch: true
})

const blockClient = new ApolloClient({
  link: new HttpLink({
    // uri: 'http://95.179.137.89:8000/subgraphs/name/bscswap/bsc-blocks-timestamp'
    uri: 'https://subgraph.bscswap.com/subgraphs/name/bscswap/bsc-blocks-timestamp',
    fetch: fetch
  }),
  cache: new InMemoryCache()
})

const relayClient = new ApolloClient({
  link: new HttpLink({
    // uri: 'https://api.thegraph.com/subgraphs/name/pine-finance/pine_orders'  // chain_id: 1
    uri: 'https://subgraph.swapliquidity.org/subgraphs/name/swapliquidity/limitorders',  // chain_id: 56
    fetch: fetch
  }),
  cache: new InMemoryCache()
})

module.exports = {
  client,
  healthClient,
  blockClient,
  relayClient
}