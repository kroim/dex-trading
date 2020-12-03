import { Currency, CurrencyAmount} from '@bscswap/sdk'
import React, { useCallback /*,useState*/} from 'react'
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
// import { useTradeExactIn } from '../../hooks/Trades'
// Use to detach input from output
// let inputValue

// const ETH_TO_TOKEN = 0
// const TOKEN_TO_ETH = 1
// const TOKEN_TO_TOKEN = 2

// function getSwapType(inputCurrency, outputCurrency) {
//     if (!inputCurrency || !outputCurrency) {
//       return null
//     } else if (inputCurrency === 'BNB') {
//       return ETH_TO_TOKEN
//     } else if (outputCurrency === 'BNB') {
//       return TOKEN_TO_ETH
//     } else {
//       return TOKEN_TO_TOKEN
//     }
//   }
export function ExchangePage({ inputCurrency, outputCurrency }: {inputCurrency: Currency, outputCurrency: Currency})  {

    const { account } = useActiveWeb3React()
    const { independentField , typedValue} = useSwapState()
    // core swap state
    const {
        v1Trade,
        v2Trade,
        currencyBalances,
        parsedAmount,
        currencies,
      } = useDerivedSwapInfo()
      currencies[Field.INPUT] = inputCurrency
      currencies[Field.OUTPUT] = outputCurrency
      
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
          onUserInput(Field.OUTPUT, value)
        },
        [onUserInput]
      )
      const onPlace = useCallback(
        () => {
        },
        []
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