import {createSelector} from "@reduxjs/toolkit";

import {RootState} from "../../../store";

const selectShipmentsState = (state: RootState) => state.shipments;
const selectShipmentsList = (state: RootState) => state.shipments.list;
export const selectShipments = createSelector([selectShipmentsState], (shipmentsState) => {
    return shipmentsState.list
});


