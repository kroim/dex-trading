import { RootState } from '../..';
import { GeetestCaptchaKeys } from './actions';

export const selectCaptchaKeys = (state: RootState): GeetestCaptchaKeys | undefined =>
    state.baseuser.captchaKeys.keys;

export const selectCaptchaDataObjectLoading = (state: RootState): boolean =>
    state.baseuser.captchaKeys.loading;
