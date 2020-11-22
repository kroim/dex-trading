import { RootState } from '../../index';
import { CommonError } from '../../types';
import { AuthState } from './reducer';

export const selectSignInRequire2FA = (state: RootState): AuthState['require2FA'] =>
    state.baseuser.auth.require2FA;

export const selectSignUpRequireVerification = (state: RootState): AuthState['requireVerification'] =>
    state.baseuser.auth.requireVerification;

export const selectSignUpError = (state: RootState): CommonError | undefined =>
    state.baseuser.auth.signUpError;

export const selectEmailVerified = (state: RootState): AuthState['emailVerified'] =>
    state.baseuser.auth.emailVerified;

export const selectCurrentPasswordEntropy = (state: RootState): AuthState['current_password_entropy'] =>
    state.baseuser.auth.current_password_entropy;
