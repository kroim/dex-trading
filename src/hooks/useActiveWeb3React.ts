import * as React from 'react';
import { useDispatch } from 'react-redux';
// import { ChainId } from '@uniswap/sdk'
// // import { selectShouldFetchWallets, walletsFetch } from '../modules';
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
// import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
// import { isMobile } from 'react-device-detect'
// import { injected } from '../connectors'
import { NetworkContextName } from '../modules/web3wallet/constants'


export const useActiveWeb3React= () => {
    // const shouldDispatch = useSelector(selectShouldFetchWallets);
    const dispatch = useDispatch();
    // const chainId = "test chain";
    // const account = "test account";
    const context = useWeb3ReactCore<Web3Provider>()
    const contextNetwork = useWeb3ReactCore<Web3Provider>(NetworkContextName)
    const result = context.active ? context : contextNetwork
    React.useEffect(() => {
    }, [dispatch,  result]);
}

