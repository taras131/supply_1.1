import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "../../../store";

const selectOrdersState = (state: RootState) => state.orders;

export const selectOrders = createSelector([selectOrdersState],
    (ordersState) => ordersState.list);

export const selectCurrentOrder = createSelector([selectOrdersState],
    (ordersState) => ordersState.current);

export const selectOrdersIsLoading = createSelector([selectOrdersState],
    (ordersState) => ordersState.isLoading);


