import { RootState } from '../../../index';
import { DocumentsState } from './reducer';

export const selectSendDocumentsSuccess = (state: RootState): DocumentsState['success'] =>
    state.baseuser.documents.success;

export const selectSendDocumentsLoading = (state: RootState): DocumentsState['loading'] =>
    state.baseuser.documents.loading;
