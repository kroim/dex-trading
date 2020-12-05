import { createAction } from '@reduxjs/toolkit'

export enum Field {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT'
}
export enum EditField {
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  RATE = 'RATE'
}
export const selectCurrency = createAction<{ field: Field; currencyId: string }>('selectCurrency')
export const switchCurrencies = createAction<void>('switchCurrencies')
export const typeInput = createAction<{ field: EditField; typedValue: string }>('typeInput')
export const replaceLimitState = createAction<{
  field: EditField
  typedValue: string
  inputCurrencyId?: string
  outputCurrencyId?: string
  recipient: string | null
  inputRateValue: string | null

}>('replaceLimitState')
export const setRecipient = createAction<{ recipient: string | null }>('setRecipient')
export const setInputRateValue = createAction<{ inputRateValue: string | null }>('setInputRateValue')



export const testAction = createAction<{ id: string | null }>('testActionType')
