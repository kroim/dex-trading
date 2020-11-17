import { applyMiddleware, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './modules';
// import application from './application/reducer'
// import user from './user/reducer'
// import transactions from './transactions/reducer'
// import swap from './swap/reducer'
// import mint from './mint/reducer'
// import lists from './lists/reducer'
// import burn from './burn/reducer'
// import multicall from './modules/web3wallet/state/multicall/reducer';

const sagaMiddleware = createSagaMiddleware();
const rangerMiddleware = createSagaMiddleware();

// tslint:disable-next-line:no-any
const composeEnhancer: typeof compose = (window as any)
    .__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    // multicall,
    composeEnhancer(
        applyMiddleware(
            sagaMiddleware,
            rangerMiddleware,
        ),
    ),
    
);


export {
    store,
    sagaMiddleware,
    rangerMiddleware,
};
