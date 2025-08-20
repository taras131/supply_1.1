import { RootState } from "../../../store";
import { createSelector } from "@reduxjs/toolkit";

const selectOrdersPositionsState = (state: RootState) => state.ordersPositions;

export const selectAllOrdersPositions = createSelector(
  [selectOrdersPositionsState],
  (ordersPositionsState) => ordersPositionsState.list,
);

export const selectOrdersPositionsIsLoading = createSelector(
    [selectOrdersPositionsState],
    (ordersPositionsState) => ordersPositionsState.isLoading,
);
