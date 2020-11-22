import { RootState } from '../../../index';
import { IdentityState } from './reducer';

export const selectEditIdentitySuccess = (state: RootState): IdentityState['edit']['success'] =>
    state.baseuser.identity.edit.success;

export const selectEditIdentityError = (state: RootState): IdentityState['edit']['error'] =>
    state.baseuser.identity.edit.error;

export const selectSendIdentitySuccess = (state: RootState): IdentityState['send']['success'] =>
    state.baseuser.identity.send.success;

export const selectSendIdentityError = (state: RootState): IdentityState['send']['error'] =>
    state.baseuser.identity.send.error;
