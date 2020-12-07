import React from 'react'
import { Field } from '../../state/swap/actions'
import { useAllTokens } from '../../hooks/Tokens'

import {
  // useDerivedSwapInfo,
  useSwapActionHandlers,
  // useSwapState,
  // useDefaultsFromCurrentMarket,
  // setSwapStateAny
} from '../../state/swap/hooks'
import { ETHER } from '@bscswap/sdk';



import {useCurrentAddressManager } from '../../state/user/hooks'



export declare const enum OrderType {
	Limit = 1,
	Market = 2,
	Stop = 3,
	StopLimit = 4
}

interface UpdateSwapOrderProps {  
  fromToken: string;
  fromKey: string;  
  toToken: string;
  toKey: string;    
}

//========= for function component in web3 module and class component of baseapp module ============== 
  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
const { forwardRef, useImperativeHandle  } = React;
export const UpdateMarketPairFroward = forwardRef((props, ref) => {

  const { onCurrencySelection } = useSwapActionHandlers()
  const [setCurrentAddress] =  useCurrentAddressManager();
  const allTokens = useAllTokens()
  
  const objSetter = (prop, obj)=>{ 
    prop = (prop + "").toLowerCase(); 
    for(var p in obj){
     if( prop === (p+ "").toLowerCase()){
           //obj[p] = prop;
           return obj[p];           
      }
   }
}
  useImperativeHandle(ref, () => ({
     
    setMarketPair(market) {
      //console.log(market)
      //console.log(allTokens)
      //console.log("----from market", objSetter(market.base_contract, allTokens));
      // console.log(onCurrencySelection)
      // onCurrencySelection(Field.INPUT, market.baseContract )
      console.log(market)
      
      setCurrentAddress("");
      if(market.quote_unit.toLowerCase()==="bnb") onCurrencySelection(Field.INPUT, ETHER)
       else  onCurrencySelection(Field.INPUT, objSetter(market.quote_contract, allTokens))

      if(market.base_unit.toLowerCase()==="bnb") onCurrencySelection(Field.OUTPUT, ETHER)
      else  onCurrencySelection(Field.OUTPUT, objSetter(market.base_contract, allTokens))      
      //alert("getAlert from Child");
    }

  }));
  return (
    <>      
    </>
  )
});

export default function UpdateSwapStateFunc({
 fromToken, toToken, fromKey, toKey
}: UpdateSwapOrderProps) {

  return (
    <>      
    </>
  )
}
