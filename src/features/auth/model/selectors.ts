import { RootState } from "../../../store";
import { createSelector } from "@reduxjs/toolkit";

const selectAuthState = (state: RootState) => state.auth;

export const selectIsAuth = createSelector([selectAuthState], (authState) => authState.isAuth);

export const selectIsAuthLoading = createSelector([selectAuthState], (authState) => authState.isLoading);
