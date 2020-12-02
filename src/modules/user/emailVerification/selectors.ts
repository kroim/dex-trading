import { RootState } from '../..';

export const selectSendEmailVerificationSuccess = (state: RootState): boolean =>
    state.baseuser.sendEmailVerification.success;

export const selectSendEmailVerificationLoading = (state: RootState): boolean =>
    state.baseuser.sendEmailVerification.loading;
