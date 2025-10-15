
import { createSelector } from "@reduxjs/toolkit";
import {RootState} from "../../../store";

const selectInvoicesState = (state: RootState) => state.invoices;

export const selectInvoices = createSelector([selectInvoicesState],
    (invoiceState) => invoiceState.list);

export const selectCurrentInvoice = createSelector([selectInvoicesState],
    (invoiceState) => invoiceState.current);

export const selectInvoicesIsLoading = createSelector([selectInvoicesState],
    (invoiceState) => invoiceState.isLoading);

export const selectInvoicesStatistics = createSelector([selectInvoicesState],
    (invoiceState) => invoiceState.statistics);

export const selectInvoicesUnpaidCount = createSelector([selectInvoicesState],
    (invoiceState) => invoiceState.statistics?.unpaid_statistics.count || null);


