import { RootState } from '../../';
import { CommonError } from '../../types';
import { WithdrawLimit } from './types';

export const selectWithdrawLimit = (state: RootState): WithdrawLimit =>
    state.baseuser.withdrawLimit.data;

export const selectWithdrawLimitLoading = (state: RootState): boolean =>
    state.baseuser.withdrawLimit.loading;

export const selectWithdrawLimitSuccess = (state: RootState): boolean =>
    state.baseuser.withdrawLimit.success;

export const selectWithdrawLimitError = (state: RootState): CommonError | undefined =>
    state.baseuser.withdrawLimit.error;

