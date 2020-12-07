import useENS from '../../hooks/useENS'
// import { Version } from '../../hooks/useToggledVersion'
import { parseUnits } from '@ethersproject/units'
import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount/*, Trade */} from '@bscswap/sdk'
import { ParsedQs } from 'qs'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { useV1Trade } from '../../data/V1'
import { useActiveWeb3React } from '../../hooks'
import { useCurrency } from '../../hooks/Tokens'
import { useTradeExactIn/*, useTradeExactOut */} from '../../hooks/Trades'
import useParsedQueryString from '../../hooks/useParsedQueryString'
import { isAddress } from '../../utils'
import { AppDispatch, AppState } from '../index'
import { useCurrencyBalances } from '../wallet/hooks'
import { Field,EditField, replaceLimitState, selectCurrency, setRecipient, switchCurrencies, typeInput, setInputRateValue } from './actions'
import { LimitState } from './reducer'
// import useToggledVersion from '../../hooks/useToggledVersion'
// import { useUserSlippageTolerance } from '../user/hooks'
// import { computeSlippageAdjustedAmounts } from '../../utils/prices'
import { getExchangeRate } from '../../utils/rate'
import { ethers } from 'ethers'
import { amountFormatter } from '../../utils'
// const RATE_OP_DIV = '/'
// const RATE_OP_MULT = 'x'
export function useLimitState(): AppState['limit'] {
  return useSelector<AppState, AppState['limit']>(state => state.limit)
}

export function useSwapActionHandlers(): {
  onCurrencySelection: (field: Field, currency: Currency) => void
  onSwitchTokens: () => void
  onUserInput: (field: EditField, typedValue: string) => void
  onUserRateInput: (typedValue: string| null) => void
  onChangeRecipient: (recipient: string | null) => void
} {
  const dispatch = useDispatch<AppDispatch>()
  const onCurrencySelection = useCallback(
    (field: Field, currency: Currency) => {
      dispatch(
        selectCurrency({
          field,
          currencyId: currency instanceof Token ? currency.address : currency === ETHER ? 'BNB' : ''
        })
      )
    },
    [dispatch]
  )

  const onSwitchTokens = useCallback(() => {
    dispatch(switchCurrencies())
  }, [dispatch])

  const onUserInput = useCallback(
    (field: EditField, typedValue: string) => {
      dispatch(typeInput({ field, typedValue }))
    },
    [dispatch]
  )
  const onUserRateInput = useCallback(
    (typedValue: string | null) => {
      dispatch(setInputRateValue({ inputRateValue: typedValue }))
    },
    [dispatch]
  )
  const onChangeRecipient = useCallback(
    (recipient: string | null) => {
      dispatch(setRecipient({ recipient }))
    },
    [dispatch]
  )

  return {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onUserRateInput,
    onChangeRecipient
  }
}

// try to parse a user entered amount for a given token
export function tryParseAmount(value?: string, currency?: Currency): CurrencyAmount | undefined {
  if (!value || !currency) {
    return
  }
  try {
    const typedValueParsed = parseUnits(value, currency.decimals).toString()
    if (typedValueParsed !== '0') {
      return currency instanceof Token
        ? new TokenAmount(currency, JSBI.BigInt(typedValueParsed))
        : CurrencyAmount.ether(JSBI.BigInt(typedValueParsed))
    }
  } catch (error) {
    // should fail if the user specifies too many decimal places of precision (or maybe exceed max uint?)
    console.debug(`Failed to parse input amount: "${value}"`, error)
  }
  // necessary for all paths to return a value
  return
}
function safeParseUnits(number, units) {
  try {
    return ethers.utils.parseUnits(number, units)
  } catch {
    try {
    const margin = units * 8
    const decimals = ethers.utils.parseUnits(number, margin)
    return decimals.div(ethers.utils.bigNumberify(10).pow(margin - units))
    }
    catch {
      return undefined
    }
  }
}
function applyExchangeRateTo(inputValue, exchangeRate, inputDecimals, outputDecimals, invert = false) {
  try {
    if (
      inputValue &&
      exchangeRate &&
      (inputDecimals || inputDecimals === 0) &&
      (outputDecimals || outputDecimals === 0)
    ) {
      const factor = ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(18))

      if (invert) {
        return inputValue
          .mul(factor)
          .div(exchangeRate)
          .mul(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(outputDecimals)))
          .div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(inputDecimals)))
      } else {
        return exchangeRate
          .mul(inputValue)
          .div(factor)
          .mul(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(outputDecimals)))
          .div(ethers.utils.bigNumberify(10).pow(ethers.utils.bigNumberify(inputDecimals)))
      }
    }
  } catch {}
}
// from the current swap inputs, compute the best trade and return it.
export function useDerivedSwapInfo(): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmount: CurrencyAmount | undefined
  // v2Trade: Trade | undefined
  inputError?: string
  // v1Trade: Trade | undefined
  inputRateValue?: string
  inputAmount: CurrencyAmount | undefined
  outputAmount: CurrencyAmount | undefined
  rateFormatted: string,
  outputValueFormatted: string,
  inputValueFormatted: string
} {
  const { account } = useActiveWeb3React()

  // const toggledVersion = useToggledVersion()

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
    inputValue,
    inputRateValue
  } = useLimitState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const recipientLookup = useENS(recipient ?? undefined)
  const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined
  ])
  const inputDecimals = inputCurrency?.decimals
  // const  outputSymbol = outCurrency.symbol
  const outputDecimals = outputCurrency?.decimals
  // const rateOp = "x"
  // declare/get parsed and formatted versions of input/output values
  const inputValueParsed = inputValue ? ethers.utils.parseUnits(inputValue, inputDecimals): undefined;
  let outputValueFormatted, inputValueFormatted
  let outputValueParsed
  let rateRaw
  let parsedAmount
  const inputAmount = tryParseAmount(inputValue,inputCurrency) ?? undefined
  const bestTradeExactIn = useTradeExactIn(
    inputAmount,
    outputCurrency
  )
  // compute useful transforms of the data above
  // const independentDecimals = independentField === INPUT || independentField === RATE ? inputDecimals : outputDecimals
  const dependentDecimals = independentField === EditField.OUTPUT ? inputDecimals : outputDecimals
  let outputAmount
  inputValueFormatted = inputValue
  switch (independentField) {
    case EditField.OUTPUT:
      outputValueParsed = typedValue? safeParseUnits(typedValue, outputDecimals) : undefined
      parsedAmount = tryParseAmount(typedValue,outputCurrency) ?? undefined
      outputAmount = parsedAmount
      outputValueFormatted = parsedAmount?.toSignificant(6) ?? ''
      rateRaw = getExchangeRate(
        inputValueParsed,
        inputDecimals,
        outputValueParsed,
        outputDecimals,
        false     // rateOp === RATE_OP_DIV
      )
      break
    case EditField.RATE:
      parsedAmount = tryParseAmount(typedValue,outputCurrency) ?? undefined
      if (!inputRateValue || Number(inputRateValue) === 0) {
        outputValueParsed = ''
        outputValueFormatted = ''
        outputAmount = undefined
      } else {
        rateRaw = safeParseUnits(inputRateValue, 18)
        outputValueParsed = applyExchangeRateTo(
          inputValueParsed,
          rateRaw,
          inputDecimals,
          outputDecimals,
          false     // rateOp === RATE_OP_DIV
        )
        outputValueFormatted = amountFormatter(
          outputValueParsed,
          dependentDecimals,
          Math.min(4, dependentDecimals),
          false
        )
        outputAmount = tryParseAmount(outputValueFormatted, outputCurrency)
      }
      break
    case EditField.INPUT:
      parsedAmount = tryParseAmount(typedValue,inputCurrency) ?? undefined
      outputValueParsed = bestTradeExactIn
        ? ethers.utils.parseUnits(bestTradeExactIn.outputAmount.toExact(), outputDecimals)
        : null
      outputValueFormatted = bestTradeExactIn ? bestTradeExactIn.outputAmount.toSignificant(6) : ''
      rateRaw = getExchangeRate(
        inputValueParsed,
        inputDecimals,
        outputValueParsed,
        outputDecimals,
        false     // rateOp === RATE_OP_DIV
      )
      outputAmount = tryParseAmount(outputValueFormatted, outputCurrency)
      
      break
    default:
      break
  }
  const rateFormatted = independentField === EditField.RATE ? inputRateValue : amountFormatter(rateRaw, 18, 4, false)
  console.log("rate = ", rateFormatted)
  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1]
  }

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined
  }

  // get link to trade on v1, if a better rate exists
  // const v1Trade = useV1Trade(isExactIn, currencies[Field.INPUT], currencies[Field.OUTPUT], parsedAmount)

  let inputError: string | undefined
  if (!account) {
    inputError = 'Connect Wallet'
  }

  if (!parsedAmount) {
    inputError = inputError ?? 'Enter an amount'
  }

  if (!currencies[Field.INPUT] || !currencies[Field.OUTPUT]) {
    inputError = inputError ?? 'Select a token'
  }

  if (!to) {
    inputError = inputError ?? 'Enter a recipient'
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    // v2Trade: v2Trade ?? undefined,
    inputError,
    // v1Trade,
    inputRateValue: inputRateValue,
    inputAmount: inputAmount,
    outputAmount: outputAmount,
    rateFormatted,
    outputValueFormatted,
    inputValueFormatted
  }
}

function parseCurrencyFromURLParameter(urlParam: any): string {
  if (typeof urlParam === 'string') {
    const valid = isAddress(urlParam)
    if (valid) return valid
    if (urlParam.toUpperCase() === 'BNB') return 'BNB'
    if (valid === false) return 'BNB'
  }
  return 'BNB' ?? ''
}

function parseTokenAmountURLParameter(urlParam: any): string {
  return typeof urlParam === 'string' && !isNaN(parseFloat(urlParam)) ? urlParam : ''
}

function parseIndependentFieldURLParameter(urlParam: any): EditField {
  if(typeof urlParam === 'string' && urlParam.toLowerCase() === 'output')
  return  EditField.OUTPUT
  else if(typeof urlParam === 'string' && urlParam.toLowerCase() === 'rate')
  return EditField.RATE
  return EditField.INPUT
}

const ENS_NAME_REGEX = /^[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)?$/
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
function validatedRecipient(recipient: any): string | null {
  if (typeof recipient !== 'string') return null
  const address = isAddress(recipient)
  if (address) return address
  if (ENS_NAME_REGEX.test(recipient)) return recipient
  if (ADDRESS_REGEX.test(recipient)) return recipient
  return null
}

export function queryParametersToLimitState(parsedQs: ParsedQs): LimitState {
  let inputCurrency = parseCurrencyFromURLParameter(parsedQs.inputCurrency)
  let outputCurrency = parseCurrencyFromURLParameter(parsedQs.outputCurrency)
  let inputRateValue = parseCurrencyFromURLParameter(parsedQs.inputRateValue)
  if (inputCurrency === outputCurrency) {
    if (typeof parsedQs.outputCurrency === 'string') {
      inputCurrency = ''
    } else {
      outputCurrency = ''
    }
  }

  const recipient = validatedRecipient(parsedQs.recipient)

  return {
    [Field.INPUT]: {
      currencyId: inputCurrency
    },
    [Field.OUTPUT]: {
      currencyId: outputCurrency
    },
    inputRateValue: inputRateValue,
    typedValue: parseTokenAmountURLParameter(parsedQs.exactAmount),
    independentField: parseIndependentFieldURLParameter(parsedQs.exactField),
    recipient,
    inputValue: ''
  }
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromURLSearch() {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const parsedQs = useParsedQueryString()

  useEffect(() => {
    if (!chainId) return
    const parsed = queryParametersToLimitState(parsedQs)

    dispatch(
      replaceLimitState({
        typedValue: parsed.typedValue,
        field: parsed.independentField,
        inputCurrencyId: parsed[Field.INPUT].currencyId,
        outputCurrencyId: parsed[Field.OUTPUT].currencyId,
        inputRateValue: parsed.inputRateValue,
        recipient: parsed.recipient,
        inputValue: ''
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])
}

// updates the swap state to use the defaults for a given network
export function useDefaultsFromCurrentMarket(inputCurrency:string, outputCurrency:string, inputRateValue:string, field: EditField) {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()  

  useEffect(() => {
    if (!chainId) return
    // console.log("--", inputCurrency)
    console.log("----input limit", inputCurrency, outputCurrency)
    dispatch(
      replaceLimitState({
        typedValue: "0",
        field: field,
        inputCurrencyId: inputCurrency,
        outputCurrencyId: outputCurrency,
        inputRateValue: inputRateValue,
        recipient: null,
        inputValue: ''
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chainId])
}

export function setLimitStateAny(inputCurrency:string, outputCurrency:string, inputRateValue:string, field: EditField) {
  console.log("--", inputCurrency)
      replaceLimitState({
        typedValue: "0",
        field: field,
        inputCurrencyId: inputCurrency,
        outputCurrencyId: outputCurrency,
        inputRateValue: inputRateValue,
        recipient: null,
        inputValue: ''
      })    
}