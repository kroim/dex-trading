import { applyMiddleware, compose, createStore } from 'redux';
import { combineReducers } from 'redux';
// import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
// import { save, load } from 'redux-localstorage-simple';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './modules';
import application from './modules/web3wallet/state/application/reducer';
import user from './modules/web3wallet/state/user/reducer';
import transactions from './modules/web3wallet/state/transactions/reducer';
import swap from './modules/web3wallet/state/swap/reducer';
import mint from './modules/web3wallet/state/mint/reducer';
import lists from './modules/web3wallet/state/lists/reducer';
import burn from './modules/web3wallet/state/burn/reducer';
import multicall from './modules/web3wallet/state/multicall/reducer';
import { updateVersion } from './modules/web3wallet/state/user/actions'

const sagaMiddleware = createSagaMiddleware();
const rangerMiddleware = createSagaMiddleware();
// const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

const composeEnhancer: typeof compose = (window as any)
    .__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducer = combineReducers({
    rootReducer,
    application,
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    lists
});
const store = createStore(
    reducer,
    composeEnhancer(
        applyMiddleware(
            sagaMiddleware,
            rangerMiddleware,
        ),
    ),
);
store.dispatch(updateVersion())
export {
    store,
    sagaMiddleware,
    rangerMiddleware,
};