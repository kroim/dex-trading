import { createStore, Store } from 'redux'
import { Field,EditField, selectCurrency } from './actions'
import reducer, { LimitState } from './reducer'

describe('swap reducer', () => {
  let store: Store<LimitState>

  beforeEach(() => {
    store = createStore(reducer, {
      [Field.OUTPUT]: { currencyId: '' },
      [Field.INPUT]: { currencyId: '' },
      typedValue: '',
      independentField: EditField.INPUT,
      recipient: null
    })
  })

  describe('selectToken', () => {
    it('changes token', () => {
      store.dispatch(
        selectCurrency({
          field: Field.OUTPUT,
          currencyId: '0x0000'
        })
      )

      expect(store.getState()).toEqual({
        [Field.OUTPUT]: { currencyId: '0x0000' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '',
        independentField: Field.INPUT,
        recipient: null
      })
    })
  })
})
