import { RootState } from '../../../index';
import { PhoneState } from './reducer';

export const sendPhoneCode = (state: RootState): PhoneState['codeSend'] =>
    state.baseuser.phone.codeSend;

export const selectVerifyPhoneSuccess = (state: RootState): PhoneState['successMessage'] =>
    state.baseuser.phone.successMessage;
