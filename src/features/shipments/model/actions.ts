import {createAsyncThunk} from "@reduxjs/toolkit";
import {INewShipments} from "../../../models/iShipments";
import {shipmentsAPI} from "../api";
import {handlerError} from "../../../store/handleError";


export const fetchAddShipment = createAsyncThunk("shipments/add", async (shipment: INewShipments, ThunkAPI) => {
    try {
        return await shipmentsAPI.addShipment(shipment);
    } catch (e) {
        return ThunkAPI.rejectWithValue(handlerError(e));
    }
});
