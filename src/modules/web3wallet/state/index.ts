import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import application from './application/reducer'
import user from './user/reducer'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import mint from './mint/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import multicall from './multicall/reducer'

import { updateVersion } from './user/actions'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

const web3_store = configureStore({
  reducer: {
    application,
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    lists
  },
  middleware: [...getDefaultMiddleware(), save({ states: PERSISTED_KEYS })],
  preloadedState: load({ states: PERSISTED_KEYS })
})

web3_store.dispatch(updateVersion())

export default web3_store

export type AppState = ReturnType<typeof web3_store.getState>
export type AppDispatch = typeof web3_store.dispatch
