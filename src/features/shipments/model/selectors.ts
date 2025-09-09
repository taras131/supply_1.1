import {createSelector} from "@reduxjs/toolkit";

import {RootState} from "../../../store";

const selectShipmentsState = (state: RootState) => state.shipments;

export const selectShipments = createSelector([selectShipmentsState],
    (shipmentState) => shipmentState.list);

export const selectShipmentById = createSelector(
    [selectShipmentsState,
        (_state: RootState, id: string | null) => id],
    (selectShipmentsState, id) => selectShipmentsState.list
        .filter(position => position.id === id)[0],
);

export const selectShipmentsIsLoading = createSelector([selectShipmentsState],
    (shipmentState) => shipmentState.isLoading);


