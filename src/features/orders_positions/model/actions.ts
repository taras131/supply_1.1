import {createAsyncThunk} from "@reduxjs/toolkit";
import {handlerError} from "../../../store/handleError";
import {ordersPositionsAPI} from "../api";
import {INewOrderPosition, IOrderPosition} from "../../../models/IOrdersPositions";
import {filesAPI} from "../../files/api";
import {selectOrdersPositionById} from "./selectors";
import {RootState} from "../../../store";

export const fetchCreateOrdersPositions = createAsyncThunk(
    "orders_positions/create",
    async (ordersPosition: INewOrderPosition, {rejectWithValue}) => {
        try {
            return await ordersPositionsAPI.create(ordersPosition);
        } catch (e) {
            console.log(e);
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchGetAllOrdersPositions = createAsyncThunk(
    "orders_positions/get_all",
    async (_, {rejectWithValue}) => {
        try {
            return await ordersPositionsAPI.getAll();
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchUpdateOrdersPositions = createAsyncThunk(
    "orders_positions/update",
    async (ordersPosition: INewOrderPosition | IOrderPosition, {rejectWithValue}) => {
        try {
            return await ordersPositionsAPI.update(ordersPosition);
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

interface IUploadPhotoData {
    file: File;
    orderPositionId: string;
}

export const fetchUploadOrdersPositionsPhoto = createAsyncThunk<
    string,
    IUploadPhotoData,
    { state: RootState }
>(
    "orders_positions/update",
    async (data_in: IUploadPhotoData, {dispatch, getState, rejectWithValue}) => {

        try {
            const {file, orderPositionId} = data_in;
            const res = await filesAPI.upload(file);
            const ordersPosition = selectOrdersPositionById(getState(), orderPositionId);
            if (!ordersPosition) return;
            const updatedOrdersPosition = {
                ...ordersPosition,
                photos: [...ordersPosition.photos, res],
            };
            return dispatch(fetchUpdateOrdersPositions(updatedOrdersPosition)).unwrap();
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);
