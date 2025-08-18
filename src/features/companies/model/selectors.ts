import { RootState } from "../../../store";
import { createSelector } from "@reduxjs/toolkit";

const selectCompaniesState = (state: RootState) => state.companies;

export const selectCompanies = createSelector([selectCompaniesState], (companiesState) => companiesState.list);

export const selectCurrentCompany = createSelector([selectCompaniesState], (companiesState) => companiesState.current);

export const selectCompanyIsLoading = createSelector(
  [selectCompaniesState],
  (companiesState) => companiesState.isLoading,
);

export const selectCurrentCompanyName = createSelector([selectCompaniesState], (companiesState) =>
  companiesState.current ? companiesState.current.name : null,
);
