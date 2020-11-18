import { RootState } from '../../index';
import { OrderCommon } from '../../types';

export const selectOpenOrdersList = (state: RootState): OrderCommon[] =>
    state.baseuser.openOrders.list;

export const selectOpenOrdersFetching = (state: RootState): boolean =>
    state.baseuser.openOrders.fetching;

export const selectCancelOpenOrdersFetching = (state: RootState): boolean =>
    state.baseuser.openOrders.cancelFetching;
