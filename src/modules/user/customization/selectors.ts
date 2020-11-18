import { RootState } from '../..';
import { CustomizationDataInterface } from '../../public/customization';
import { CommonError } from '../../types';

export const selectCustomizationUpdateData = (state: RootState): CustomizationDataInterface | undefined =>
    state.baseuser.customizationUpdate.data;

export const selectCustomizationUpdateSuccess = (state: RootState): boolean =>
    state.baseuser.customizationUpdate.success;

export const selectCustomizationUpdateLoading = (state: RootState): boolean =>
    state.baseuser.customizationUpdate.loading;

export const selectCustomizationUpdateError = (state: RootState): CommonError | undefined =>
    state.baseuser.customizationUpdate.error;
