import { applyMiddleware, compose, createStore } from 'redux';
// import { combineReducers } from 'redux';
// import { getDefaultMiddleware } from '@reduxjs/toolkit';
import { save } from 'redux-localstorage-simple';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './modules';
import thunk from 'redux-thunk';
import { updateVersion } from './modules/web3wallet/state/user/actions'

const sagaMiddleware = createSagaMiddleware();
const rangerMiddleware = createSagaMiddleware();
const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']
const composeEnhancer: typeof compose = (window as any)
    .__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    composeEnhancer(
        applyMiddleware(
            thunk,
            sagaMiddleware,
            rangerMiddleware,
            save({ states: PERSISTED_KEYS })
        ),
    ),
);
store.dispatch(updateVersion())
export {
    store,
    sagaMiddleware,
    rangerMiddleware,
};
