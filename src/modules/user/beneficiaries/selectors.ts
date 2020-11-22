import { RootState } from '../../../modules';
import { CommonError } from '../../../modules/types';
import { Beneficiary } from './types';


/* Beneficiaries fetch */
export const selectBeneficiaries = (state: RootState): Beneficiary[] =>
    state.baseuser.beneficiaries.fetch.data;

export const selectBeneficiariesFetchLoading = (state: RootState): boolean =>
    state.baseuser.beneficiaries.fetch.fetching;

export const selectBeneficiariesFetchSuccess = (state: RootState): boolean =>
    state.baseuser.beneficiaries.fetch.success;

export const selectBeneficiariesFetchError = (state: RootState): CommonError | undefined =>
    state.baseuser.beneficiaries.fetch.error;

/* Beneficiaries activate */
export const selectBeneficiariesActivateData = (state: RootState): Beneficiary =>
    state.baseuser.beneficiaries.activate.data;

export const selectBeneficiariesActivateLoading = (state: RootState): boolean =>
    state.baseuser.beneficiaries.activate.fetching;

export const selectBeneficiariesActivateSuccess = (state: RootState): boolean =>
    state.baseuser.beneficiaries.activate.success;

export const selectBeneficiariesActivateError = (state: RootState): CommonError | undefined =>
    state.baseuser.beneficiaries.activate.error;

/* Beneficiaries create */
export const selectBeneficiariesCreate = (state: RootState): Beneficiary =>
    state.baseuser.beneficiaries.create.data;

export const selectBeneficiariesCreateLoading = (state: RootState): boolean =>
    state.baseuser.beneficiaries.create.fetching;

export const selectBeneficiariesCreateSuccess = (state: RootState): boolean =>
    state.baseuser.beneficiaries.create.success;

export const selectBeneficiariesCreateError = (state: RootState): CommonError | undefined =>
    state.baseuser.beneficiaries.create.error;

/* Beneficiaries delete */

export const selectBeneficiariesDeleteLoading = (state: RootState): boolean =>
    state.baseuser.beneficiaries.delete.fetching;

export const selectBeneficiariesDeleteSuccess = (state: RootState): boolean =>
    state.baseuser.beneficiaries.delete.success;

export const selectBeneficiariesDeleteError = (state: RootState): CommonError | undefined =>
    state.baseuser.beneficiaries.delete.error;
