import { ApiKeys2FAModal, ApiKeysState, RootState } from '../../index';

export const selectApiKeys = (state: RootState): ApiKeysState['apiKeys'] => state.baseuser.apiKeys.apiKeys;

export const selectApiKeysDataLoaded = (state: RootState): ApiKeysState['dataLoaded'] => state.baseuser.apiKeys.dataLoaded;

export const selectApiKeysModal = (state: RootState): ApiKeys2FAModal['payload'] => state.baseuser.apiKeys.modal;
