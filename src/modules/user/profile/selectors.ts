import { RootState } from '../..';
import { User } from './types';

export const selectChangePasswordSuccess = (state: RootState): boolean | undefined =>
    state.baseuser.profile.passwordChange.success;

export const selectTwoFactorAuthQR = (state: RootState): string =>
    state.baseuser.profile.twoFactorAuth.url;

export const selectTwoFactorAuthBarcode = (state: RootState): string =>
    state.baseuser.profile.twoFactorAuth.barcode;

export const selectTwoFactorAuthSuccess = (state: RootState): boolean | undefined =>
    state.baseuser.profile.twoFactorAuth.success;

export const selectUserLoggedIn = (state: RootState): boolean => {
    const { baseuser: { profile } } = state;    
    return !profile.userData.isFetching && profile.userData.user.state === 'active';
};

export const selectUserInfo = (state: RootState): User =>
    state.baseuser.profile.userData.user;

export const selectUserFetching = (state: RootState): boolean =>
    state.baseuser.profile.userData.isFetching;

export const selectUserDataChange = (state: RootState): boolean | undefined =>
    state.baseuser.profile.userData.success;
