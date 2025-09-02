import {createSelector} from "@reduxjs/toolkit";

import {RootState} from "../../../store";

const selectShipmentsState = (state: RootState) => state.shipments;

export const selectShipments = createSelector([selectShipmentsState],
    (shipmentState) => shipmentState.list);


