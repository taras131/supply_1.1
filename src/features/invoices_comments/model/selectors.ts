import {RootState} from "../../../store";
import {createSelector} from "@reduxjs/toolkit";

const selectInvoicesCommentsState = (state: RootState) => state.invoicesComments;

export const selectAllInvoicesComments = createSelector([selectInvoicesCommentsState],
    (machineryCommentsState) => {
        const active = machineryCommentsState.list.filter((c) => c.is_active !== false);
        const inactive = machineryCommentsState.list.filter((c) => c.is_active === false);
        return [...active, ...inactive];
    });

export const selectInvoicesCommentsIsLoading = createSelector([selectInvoicesCommentsState],
    (machineryCommentsState) => {
        return machineryCommentsState.isLoading;
    });

export const selectInvoicesCommentsCount = createSelector([selectInvoicesCommentsState],
    (machineryCommentsState) => {
        return machineryCommentsState.list.filter((c) => c.is_active !== false)?.length || null
    });