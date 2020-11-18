import { RootState } from '../../index';
import { WalletHistoryList } from './types';

export const selectHistory = (state: RootState): WalletHistoryList =>
    state.baseuser.history.list;

export const selectCurrentPage = (state: RootState): number =>
    state.baseuser.history.page;

export const selectFirstElemIndex = (state: RootState, limit): number =>
    (state.baseuser.history.page * limit) + 1;

export const selectLastElemIndex = (state: RootState, limit: number): number =>
    (state.baseuser.history.page * limit) + state.baseuser.history.list.length;

export const selectNextPageExists = (state: RootState, limit: number): boolean =>
    state.baseuser.history.nextPageExists;

export const selectHistoryLoading = (state: RootState): boolean =>
    state.baseuser.history.fetching;
