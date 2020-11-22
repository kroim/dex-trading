import { RootState } from '../../';
import { CommonError } from '../../types';
import { Wallet } from './types';

export const selectWallets = (state: RootState): Wallet[] =>
    state.baseuser.wallets.wallets.list;

export const selectWalletsLoading = (state: RootState): boolean =>
    state.baseuser.wallets.wallets.loading;

export const selectWithdrawSuccess = (state: RootState): boolean =>
    state.baseuser.wallets.wallets.withdrawSuccess;

export const selectWalletsTimestamp = (state: RootState): number | undefined =>
    state.baseuser.wallets.wallets.timestamp;

export const selectWalletsAddressError = (state: RootState): CommonError | undefined =>
    state.baseuser.wallets.wallets.error;

export const selectMobileWalletUi = (state: RootState): string =>
    state.baseuser.wallets.wallets.mobileWalletChosen;

export const selectWalletCurrency = (state: RootState): string =>
    state.baseuser.wallets.wallets.selectedWalletCurrency;

export const selectWalletAddress = (state: RootState): string =>
    state.baseuser.wallets.wallets.selectedWalletAddress;

export const selectShouldFetchWallets = (state: RootState): boolean =>
    !selectWalletsTimestamp(state) && !selectWalletsLoading(state);
