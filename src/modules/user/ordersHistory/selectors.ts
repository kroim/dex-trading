import { RootState } from '../../index';
import { OrderCommon } from '../../types';

export const selectOrdersHistory = (state: RootState): OrderCommon[] =>
    state.baseuser.ordersHistory.list;

export const selectCurrentPageIndex = (state: RootState): number =>
    state.baseuser.ordersHistory.pageIndex;

export const selectOrdersFirstElemIndex = (state: RootState, limit: number): number =>
    (state.baseuser.ordersHistory.pageIndex * limit) + 1;

export const selectOrdersLastElemIndex = (state: RootState, limit: number): number =>
    (state.baseuser.ordersHistory.pageIndex * limit) + state.baseuser.ordersHistory.list.length;

export const selectOrdersNextPageExists = (state: RootState): boolean =>
    state.baseuser.ordersHistory.nextPageExists;

export const selectOrdersHistoryLoading = (state: RootState): boolean =>
    state.baseuser.ordersHistory.fetching;

export const selectCancelAllFetching = (state: RootState): boolean =>
    state.baseuser.ordersHistory.cancelAllFetching;

export const selectCancelFetching = (state: RootState): boolean =>
    state.baseuser.ordersHistory.cancelFetching;

export const selectShouldFetchCancelAll = (state: RootState): boolean =>
    !selectCancelAllFetching(state) && !!selectOrdersHistory(state).length;

export const selectShouldFetchCancelSingle = (state: RootState): boolean =>
    !selectCancelFetching(state) && !!selectOrdersHistory(state).length;
