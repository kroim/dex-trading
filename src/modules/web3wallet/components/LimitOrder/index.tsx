import { Currency, CurrencyAmount, Token, ETHER/*, Trade*/} from '@bscswap/sdk'
import React, { useCallback /*,useState*/} from 'react'
import ReactGA from 'react-ga'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import PriceInputPanel from '../../components/PriceInputPanel'

import { Field } from '../../state/limit/actions'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import {
    useDerivedSwapInfo,
    useSwapActionHandlers,
    useSwapState,
    // setSwapStateAny
  } from '../../state/limit/hooks'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import {/* ButtonError, ButtonLight, */ButtonError } from '../../components/Button'
import { useActiveWeb3React } from '../../hooks'
import { BNB_ADDRESS, LIMIT_ORDER_MODULE_ADDRESSES} from '../../constants'
import { useUniswapExContract } from '../../hooks/useContract'
import { ethers } from 'ethers'
import { useTransactionAdder } from '../../state/transactions/hooks'
// import {currencyId} from '../../utils/currencyId'
// import { useTradeExactIn } from '../../hooks/Trades'
// Use to detach input from output
// let inputValue

const ETH_TO_TOKEN = 0
const TOKEN_TO_ETH = 1
const TOKEN_TO_TOKEN = 2

function getSwapType(inputCurrency, outputCurrency) {
    if (!inputCurrency || !outputCurrency) {
      return null
    } else if (inputCurrency === 'BNB') {
      return ETH_TO_TOKEN
    } else if (outputCurrency === 'BNB') {
      return TOKEN_TO_ETH
    } else {
      return TOKEN_TO_TOKEN
    }
  }
export function ExchangePage({ inCurrency, outCurrency }: {inCurrency: Currency, outCurrency: Currency})  {

  const { account, chainId, library } = useActiveWeb3React()
  const { independentField , typedValue} = useSwapState()
  const uniswapEXContract = useUniswapExContract()
  const addTransaction = useTransactionAdder()
  // core swap state

  const {
      v1Trade,
      v2Trade,
      currencyBalances,
      parsedAmount,
      currencies,
    } = useDerivedSwapInfo()
    currencies[Field.INPUT] = inCurrency
    currencies[Field.OUTPUT] = outCurrency
  // get swap type from the currency types
  const inputCurrency = inCurrency instanceof Token ? inCurrency.address : inCurrency === ETHER ? 'BNB' : ''
  const outputCurrency = outCurrency instanceof Token ? outCurrency.address : outCurrency === ETHER ? 'BNB' : ''

  const swapType = getSwapType(inputCurrency, outputCurrency)  
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const { wrapType } = useWrapCallback(
      currencies[Field.INPUT],
      currencies[Field.OUTPUT],
      typedValue
    )
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const toggledVersion = useToggledVersion()
  const trade = showWrap
  ? undefined
  : {
    [Version.v1]: v1Trade,
    [Version.v2]: v2Trade
  }[toggledVersion]

  const parsedAmounts = showWrap
  ? {
    [Field.INPUT]: parsedAmount,
    [Field.OUTPUT]: parsedAmount
  }
  : {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount
  }
  const formattedAmounts = {
      [independentField]: typedValue,
      [dependentField]: showWrap
        ? parsedAmounts[independentField]?.toExact() ?? ''
        : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
    }
  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))
  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()
  const handleTypeInput = useCallback(
      (value: string) => {
        onUserInput(Field.INPUT, value)
      },
      [onUserInput]
  )
  const handleTypeOutput = useCallback(
      (value: string) => {
        onUserInput(Field.OUTPUT, value)
      },
      [onUserInput]
    )
  const handleTypePrice = useCallback(
      (value: string) => {
        onUserInput(Field.PRICE, value)
      },
      [onUserInput]
    )
      // modal and loading
  // const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
  //   showConfirm: boolean
  //   tradeToConfirm: Trade | undefined
  //   attemptingTxn: boolean
  //   swapErrorMessage: string | undefined
  //   txHash: string | undefined
  // }>({
  //   showConfirm: false,
  //   tradeToConfirm: undefined,
  //   attemptingTxn: false,
  //   swapErrorMessage: undefined,
  //   txHash: undefined
  // })
    const onPlace = useCallback(
      () => {
      let method, fromCurrency, toCurrency, inputAmount, minimumReturn, data
      ReactGA.event({
          category: 'place',
          action: 'place'
        })
      inputAmount = parsedAmounts[Field.INPUT].raw.toString()
      minimumReturn = parsedAmounts[Field.OUTPUT].raw.toString()


      if (swapType === ETH_TO_TOKEN) {
        //@TODO: change it later
        method = uniswapEXContract.encodeEthOrder
        fromCurrency = BNB_ADDRESS
        toCurrency = outputCurrency
        } else if (swapType === TOKEN_TO_ETH) {
        method = uniswapEXContract.encodeTokenOrder
        fromCurrency = inputCurrency
        toCurrency = BNB_ADDRESS
        } else if (swapType === TOKEN_TO_TOKEN) {
        method = uniswapEXContract.encodeTokenOrder
        fromCurrency = inputCurrency
        toCurrency = outputCurrency
      }
      try {
        // Prefix Hex for secret message
        // this secret it's only intended for avoiding relayer front-running
        // so a decreased entropy it's not an issue
        const secret = ethers.utils.hexlify(ethers.utils.randomBytes(13)).replace('0x', '')
        //Ethers version 4.0  there iwas no 0x, but 5.0 needs 0x
        const fullSecret = `0x206c696d69745f6f72646572732020d83ddc09${secret}`
        const { privateKey, address } = new ethers.Wallet(fullSecret)
        const abiCoder = new ethers.utils.AbiCoder()
        data = (swapType === ETH_TO_TOKEN
        ? method(
            LIMIT_ORDER_MODULE_ADDRESSES[chainId],
            fromCurrency,
            account,
            address,
            abiCoder.encode(['address', 'uint256'], [toCurrency, minimumReturn]),
            privateKey
            )
        : method(
            LIMIT_ORDER_MODULE_ADDRESSES[chainId],
            fromCurrency,
            account,
            address,
            abiCoder.encode(['address', 'uint256'], [toCurrency, minimumReturn]),
            privateKey,
            inputAmount
            ))
        data.then(function (result) {
        // const order = swapType === ETH_TO_TOKEN ? data : `0x${data.slice(267)}`
          // const order = {
          //   inputAmount: inputAmount.toString(),
          //   creationAmount: inputAmount.toString(),
          //   inputToken: fromCurrency.toLowerCase(),
          //   id: '???',
          //   minReturn: minimumReturn.toString(),
          //   module: LIMIT_ORDER_MODULE_ADDRESSES[chainId].toLowerCase(),
          //   owner: account.toLowerCase(),
          //   secret: privateKey,
          //   status: 'open',
          //   outputToken: toCurrency.toLowerCase(),
          //   witness: address.toLowerCase()
          //   }
            // saveOrder(account, order, chainId)
          let res
          if (swapType === ETH_TO_TOKEN) {
          res = uniswapEXContract.depositEth(result, { value: inputAmount })
          } else {
          const provider = new ethers.providers.Web3Provider(library.provider)
          res = provider.getSigner().sendTransaction({
              to: fromCurrency,
              data: result
            })
          }
          res.then(function(response)
          {
            if (response.hash) {
              addTransaction(response, { summary: "Place Limit Order transaction"+ {response}  })
            }
          }).catch(function(err){
            console.log('transaction failed', err.message)
          })
        }).catch(function(err)
        {
          console.log('transaction failed', err.message)
        })
      } catch (e) {
          console.log('Error on place order', e.message)
      }
  },
  [account, addTransaction, chainId, library, swapType, uniswapEXContract, parsedAmounts, inputCurrency, outputCurrency]
)
    return (
        <AutoColumn gap={'md'}>
            <CurrencyInputPanel
                label={independentField === Field.OUTPUT && !showWrap ? 'From' : 'From'}
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                disableCurrencySelect={true}
                onUserInput={handleTypeInput}
                onMax={() => {
                maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact())
                }}
                onCurrencySelect={currency => {
                // setApprovalSubmitted(false) // reset 2 step UI for approvals
                onCurrencySelection(Field.INPUT, currency)
                }}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
            />
            <PriceInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypePrice}
                label={'Price'}
                // showMaxButton={false}
                // currency={null}
                // onCurrencySelect={address => onCurrencySelection(Field.OUTPUT, address)}
                // otherCurrency={null}
                id="swap-currency-price"
            />
            <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label={independentField === Field.INPUT && !showWrap ? 'To' : 'To'}
                showMaxButton={false}
                currency={currencies[Field.OUTPUT]}
                disableCurrencySelect={true}
                onCurrencySelect={address => onCurrencySelection(Field.OUTPUT, address)}
                otherCurrency={currencies[Field.INPUT]}
                id="swap-currency-output"
            />
            <ButtonError
            disabled={!account}
            onClick={onPlace}
            error={false}
            >
            {'place'}
            </ButtonError>
            </AutoColumn>
    )
}