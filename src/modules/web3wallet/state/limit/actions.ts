import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  RATE = 'RATE'
}

export const selectCurrency = createAction<{ field: Field; currencyId: string }>('selectCurrency')
export const switchCurrencies = createAction<void>('switchCurrencies')
export const typeInput = createAction<{ field: Field; typedValue: string }>('typeInput')
export const replaceSwapState = createAction<{
  field: Field
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
  inputRateValue?: string
}>('replaceSwapState1')
export const setRecipient = createAction<{ recipient: string | null }>('setRecipient')

export const testAction = createAction<{ id: string | null }>('testActionType')
