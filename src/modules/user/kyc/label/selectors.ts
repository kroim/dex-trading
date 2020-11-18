import { RootState } from '../../../index';
import { Label } from './actions';

export const selectLabelData = (state: RootState): Label[] =>
    state.baseuser.label.data;

export const selectLabelFetching = (state: RootState): boolean =>
    state.baseuser.label.isFetching;
