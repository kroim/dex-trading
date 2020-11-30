import { Token, ChainId, WETH } from 'uniswap-v2-sdk'
import { ethers } from 'ethers'

// @TODO: we should test fortmatic, portis, walletconnect, walletlink before adding
import { injected, fortmatic } from '../connectors'

export const BNB_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export const ORDER_GRAPH = {
  1: 'https://api.thegraph.com/subgraphs/name/pine-finance/pine_orders',
  4: 'https://api.thegraph.com/subgraphs/name/pine-finance/pine_orders_rinkeby',
  56: 'https://subgraph.swapliquidity.org/subgraphs/name/swapliquidity/limitorders',
  97: 'https://subgraph.swapliquidity.org/subgraphs/name/swapliquidity/limitorders_testnet'
  
}

export const FACTORY_ADDRESSES = {
  1: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95',
  3: '0x9c83dCE8CA20E9aAF9D3efc003b2ea62aBC08351',
  4: '0xf5D915570BC477f9B8D6C0E980aA81757A3AaC36',
  42: '0xD3E51Ef092B2845f10401a0159B2B96e8B6c3D30',
  56: '0x553990F2CBA90272390f62C5BDb1681fFc899675',
  97: '0xC08C219D666b61f114cAB3763824806aC7e63C0C'
}

export const MULTICALL_ADDRESS = {
  1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
  4: '0x751c5b6c24ee8687c0d5f1c26813c4a09406c904'
}

export const UNISWAPEX_ADDRESSES = {
  [ChainId.MAINNET]: '0xD412054ccA18A61278ceD6F674A526A6940eBd84',
  [ChainId.ROPSTEN]: '',
  [ChainId.RINKEBY]: '0xD412054ccA18A61278ceD6F674A526A6940eBd84',
  [ChainId.BSC_MAINNET]: '0x22CCc580eB87C3B90126a71Fc2DF72449318451f',
  [ChainId.BSC_TESTNET]: '0xeE053b05Fee109d0CB49E5a225AC1736d5E9fF72'
}

export const LIMIT_ORDER_MODULE_ADDRESSES = {
  [ChainId.MAINNET]: '0x037fc8e71445910e1E0bBb2a0896d5e9A7485318',
  [ChainId.RINKEBY]: '0x037fc8e71445910e1E0bBb2a0896d5e9A7485318',
  [ChainId.BSC_MAINNET]: '0xA4410E6891245100F1dd4B57e2d631DBc1267Cf3',
  [ChainId.BSC_TESTNET]: '0x800934C7a9716fafb0a703Fb256f73D3767cF93e'
  
}

export const UNISWAPV2_ADDRESSES = {
  1: {
    FACTORY: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
  },
  3: {
    FACTORY: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
  },
  56: {
    FACTORY: '0x553990F2CBA90272390f62C5BDb1681fFc899675'
  },
  97: {
    FACTORY: '0xC08C219D666b61f114cAB3763824806aC7e63C0C'
  }
}

export const GENERIC_GAS_LIMIT_ORDER_EXECUTE = ethers.utils.bigNumberify(400000)

export const ROUTER_ADDRESS = '0xbd67d157502A23309Db761c41965600c2Ec788b2'

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')

export const B_DAI = new Token(ChainId.BSC_MAINNET, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Token')
export const BUSD = new Token(ChainId.BSC_MAINNET, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'BUSD Token')
export const B_USDT = new Token(ChainId.BSC_MAINNET, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD')

export const T_DAI = new Token(ChainId.BSC_TESTNET, '0xEC5dCb5Dbf4B114C9d0F65BcCAb49EC54F6A0867', 18, 'DAI', 'Dai Token')
export const T_BUSD = new Token(ChainId.BSC_TESTNET, '0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee', 6, 'BUSD', 'BUSD Token')
export const T_USDT = new Token(ChainId.BSC_TESTNET, '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', 6, 'USDT', 'Tether USD')

const WETH_ONLY = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
  [ChainId.BSC_MAINNET]: [WETH[ChainId.BSC_MAINNET]],
  [ChainId.BSC_TESTNET]: [WETH[ChainId.BSC_TESTNET]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, COMP, MKR]
}

export const NetworkContextName = 'NETWORK'

const TESTNET_CAPABLE_WALLETS = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  }
}

export const SUPPORTED_WALLETS = {
  ...TESTNET_CAPABLE_WALLETS,
  ...{
    // WALLET_CONNECT: {
    //   connector: walletconnect,
    //   name: 'WalletConnect',
    //   iconName: 'walletConnectIcon.svg',
    //   description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    //   href: null,
    //   color: '#4196FC',
    //   mobile: true
    // },
    // WALLET_LINK: {
    //   connector: walletlink,
    //   name: 'Coinbase Wallet',
    //   iconName: 'coinbaseWalletIcon.svg',
    //   description: 'Use Coinbase Wallet app on mobile device',
    //   href: null,
    //   color: '#315CF5'
    // },
    // COINBASE_LINK: {
    //   name: 'Open in Coinbase Wallet',
    //   iconName: 'coinbaseWalletIcon.svg',
    //   description: 'Open in Coinbase Wallet app.',
    //   href: 'https://go.cb-w.com/mtUDhEZPy1',
    //   color: '#315CF5',
    //   mobile: true,
    //   mobileOnly: true
    // },
    FORTMATIC: {
      connector: fortmatic,
      name: 'Fortmatic',
      iconName: 'fortmaticIcon.png',
      description: 'Login using Fortmatic hosted wallet',
      href: null,
      color: '#6748FF',
      mobile: true
    }
    // Portis: {
    //   connector: portis,
    //   name: 'Portis',
    //   iconName: 'portisIcon.png',
    //   description: 'Login using Portis hosted wallet',
    //   href: null,
    //   color: '#4A6C9B',
    //   mobile: true
    // }
  }
}

export const MULTICALL_NETWORKS = {
  [ChainId.MAINNET]: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
  [ChainId.ROPSTEN]: '0x53C43764255c17BD724F74c4eF150724AC50a3ed',
  [ChainId.KOVAN]: '0x2cc8688C5f75E365aaEEb4ea8D6a480405A48D2A',
  [ChainId.RINKEBY]: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
  [ChainId.GÖRLI]: '0x77dCa2C955b15e9dE4dbBCf1246B4B85b651e50e',
  [ChainId.BSC_MAINNET]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
  [ChainId.BSC_TESTNET]: '0xe348b292e8eA5FAB54340656f3D374b259D658b8'
}
