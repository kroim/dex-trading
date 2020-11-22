import { RootState } from '../../index';
import { WalletNewHistoryList } from './types';

export const selectNewHistory = (state: RootState): WalletNewHistoryList =>
    state.baseuser.newHistory.list;

export const selectNewHistoryLoading = (state: RootState): boolean =>
    state.baseuser.newHistory.fetching;
