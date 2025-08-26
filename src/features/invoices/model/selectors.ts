
import { createSelector } from "@reduxjs/toolkit";
import {RootState} from "../../../store";

const selectInvoicesState = (state: RootState) => state.invoices;

export const selectInvoices = createSelector([selectInvoicesState],
    (ordersState) => ordersState.list);

export const selectCurrentInvoice = createSelector([selectInvoicesState],
    (ordersState) => ordersState.current);

export const selectInvoicesIsLoading = createSelector([selectInvoicesState],
    (ordersState) => ordersState.isLoading);


