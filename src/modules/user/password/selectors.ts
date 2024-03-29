import { RootState } from '../../';
import { PasswordState } from './reducer';

export const selectForgotPasswordSuccess = (state: RootState): PasswordState['forgotPasswordRequested'] =>
    state.baseuser.password.forgotPasswordRequested;

export const selectChangeForgotPasswordSuccess = (state: RootState): PasswordState['forgotPasswordChanged'] =>
    state.baseuser.password.forgotPasswordChanged;
