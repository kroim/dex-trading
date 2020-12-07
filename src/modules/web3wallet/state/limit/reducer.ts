import { createReducer } from '@reduxjs/toolkit'
import { Field, replaceLimitState, selectCurrency, setRecipient, switchCurrencies, testAction, typeInput, setInputRateValue, EditField } from './actions'

export interface LimitState {
  readonly independentField: EditField
  readonly typedValue: string
  readonly [Field.INPUT]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.OUTPUT]: {
    readonly currencyId: string | undefined
  }
  readonly inputRateValue: string | undefined
  readonly inputValue: string | undefined

  // the typed recipient address or ENS name, or null if swap should go to sender
  readonly recipient: string | null
}

const initialState: LimitState = {
  independentField: EditField.INPUT,
  typedValue: '',
  [Field.INPUT]: {
    currencyId: ''
  },
  [Field.OUTPUT]: {
    currencyId: ''
  },
  inputRateValue: '',
  recipient: null,
  inputValue: ''
}

export default createReducer<LimitState>(initialState, builder =>
  builder
    .addCase(
      replaceLimitState,
      (state, { payload: { typedValue, recipient, field, inputCurrencyId, outputCurrencyId, inputRateValue, inputValue } }) => {
        return {
          [Field.INPUT]: {
            currencyId: inputCurrencyId
          },
          [Field.OUTPUT]: {
            currencyId: outputCurrencyId
          },
          inputRateValue: inputRateValue,
          independentField: field,
          typedValue: typedValue,
          recipient,
          inputValue: ''
        }
      }
    )
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {

      const otherField = field === Field.INPUT ? Field.OUTPUT : Field.INPUT 
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === EditField.INPUT ? EditField.OUTPUT : state.independentField === EditField.RATE ? EditField.RATE: EditField.INPUT,
          [field]: { currencyId: currencyId },
          [otherField]: { currencyId: state[field].currencyId }
        }
      } else {
        // the normal case
        return {
          ...state,
          [field]: { currencyId: currencyId }
        }
      }
    })
    .addCase(testAction, state => {
      console.log('testAction is called...');
    })
    .addCase(switchCurrencies, state => {
      return {
        ...state,
        independentField: state.independentField === EditField.INPUT ? EditField.OUTPUT : state.independentField === EditField.RATE ? EditField.RATE : EditField.INPUT,
        [Field.INPUT]: { currencyId: state[Field.OUTPUT].currencyId },
        [Field.OUTPUT]: { currencyId: state[Field.INPUT].currencyId }
      }
    })
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      state.independentField = field
      if(field === EditField.INPUT)
      {
        state.inputValue = typedValue
      }
      state.typedValue = typedValue
    })
    .addCase(setRecipient, (state, { payload: { recipient } }) => {
      state.recipient = recipient
    })
    .addCase(setInputRateValue, (state, { payload: { inputRateValue } }) => {
      state.inputRateValue = inputRateValue
      state.independentField = EditField.RATE
    })

)
