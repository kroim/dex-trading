import { Currency, CurrencyAmount} from '@bscswap/sdk'
import React, { useCallback } from 'react'
import { AutoColumn } from '../../components/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { Field } from '../../state/swap/actions'
import useToggledVersion, { Version } from '../../hooks/useToggledVersion'
import {
    useDerivedSwapInfo,
    useSwapActionHandlers,
    useSwapState,
    // setSwapStateAny
  } from '../../state/swap/hooks'
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
export function ExchangePage({ initialCurrency }: {initialCurrency: Currency})  {
    const { independentField , typedValue} = useSwapState()
    const {
        v1Trade,
        v2Trade,
        currencyBalances,
        parsedAmount,
        currencies,
      } = useDerivedSwapInfo()
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
      // check if user has gone through approval process, used to show two step buttons, reset on token change
//   const [ setApprovalSubmitted] = useState<boolean>(false)
    return (
        <AutoColumn gap={'md'}>
            <CurrencyInputPanel
                  label={independentField === Field.OUTPUT && !showWrap ? 'From (estimated)' : 'From'}
                  value={formattedAmounts[Field.INPUT]}
                  showMaxButton={!atMaxAmountInput}
                  currency={currencies[Field.INPUT]}
                  disableCurrencySelect={false}
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
        </AutoColumn>
    )
}