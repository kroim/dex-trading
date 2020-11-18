import { RootState } from '../../';

export const selectUserActivity = (state: RootState) =>
    state.baseuser.userActivity.list;

export const selectTotalNumber = (state: RootState): number =>
    state.baseuser.userActivity.total;

export const selectUserActivityCurrentPage = (state: RootState): number =>
    state.baseuser.userActivity.page;


export const selectUserActivityPageCount = (state: RootState, limit): number =>
    Math.ceil(state.baseuser.userActivity.total / limit);

export const selectUserActivityFirstElemIndex = (state: RootState, limit): number =>
    (state.baseuser.userActivity.page * limit) + 1;

export const selectUserActivityLastElemIndex = (state: RootState, limit: number): number => {
    if ((state.baseuser.userActivity.page * limit) + limit > selectTotalNumber(state)) {
        return selectTotalNumber(state);
    } else {
        return (state.baseuser.userActivity.page * limit) + limit;
    }
};

export const selectUserActivityNextPageExists = (state: RootState, limit: number): boolean =>
    (state.baseuser.userActivity.page + 1) < selectUserActivityPageCount(state, limit);

export const selectUserActivityLoading = (state: RootState): boolean =>
    state.baseuser.userActivity.loading;
