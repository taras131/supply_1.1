import {createAsyncThunk} from "@reduxjs/toolkit";
import {handlerError} from "../../../store/handleError";
import {ordersPositionsAPI} from "../api";
import {INewOrderPosition, IOrderPosition} from "../../../models/IOrdersPositions";
import {filesAPI} from "../../files/api";
import {selectOrdersPositionById} from "./selectors";
import {RootState} from "../../../store";
import {selectCurrentProblem} from "../../machinery_problems/model/selectors";
import {fetchUpdateMachineryProblem} from "../../machinery_problems/model/actions";

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
            console.log(ordersPosition);
            return await ordersPositionsAPI.update(ordersPosition);
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export interface IPositionUploadPhotoData {
    files: FileList;
    orderPositionId: string;
}

export const fetchUploadOrdersPositionsPhoto = createAsyncThunk<
    string,
    IPositionUploadPhotoData,
    { state: RootState }
>(
    "orders_positions/upload_photo",
    async (data_in: IPositionUploadPhotoData, {dispatch, getState, rejectWithValue}) => {
        try {
            const {files, orderPositionId} = data_in;
            const fileArr = Array.from(files);
            const uploads = fileArr.map(async (file, i) => {
                const fileName = await filesAPI.upload(file);
                return fileName as string;
            });
            const file_names = await Promise.all(uploads);
            const ordersPosition = selectOrdersPositionById(getState(), orderPositionId);
            if (!ordersPosition) return;
            const updatedOrdersPosition = {
                ...ordersPosition,
                photos: ordersPosition.photos
                    ? [...ordersPosition.photos, ...file_names]
                    : [...file_names],
            };
            return dispatch(fetchUpdateOrdersPositions(updatedOrdersPosition)).unwrap();
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export interface IPositionDeletePhotoData {
    deletePhotoName: string;
    orderPositionId: string;
}

export const fetchDeleteOrdersPositionPhoto = createAsyncThunk<
    string, IPositionDeletePhotoData, { state: RootState }
>(
    "orders_positions/delete_photo",
    async (data_in: IPositionDeletePhotoData, {rejectWithValue, dispatch, getState}) => {
        const {deletePhotoName, orderPositionId} = data_in;
        try {
            const position = selectOrdersPositionById(getState(), orderPositionId);
            if (!position) return;
            const updatedPosition = {
                ...position,
                photos: [...position.photos.filter((photo) => photo !== deletePhotoName)],
            };
            console.log(deletePhotoName)
            const res = await filesAPI.delete(deletePhotoName);
            console.log(res)
            return dispatch(fetchUpdateOrdersPositions(updatedPosition)).unwrap();
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchDeleteOrdersPositions = createAsyncThunk(
    "orders_positions/delete",
    async (id: string, {rejectWithValue}) => {
        try {
            await ordersPositionsAPI.delete(id);
            return id
        } catch (e) {
            console.log(e);
            return rejectWithValue(handlerError(e));
        }
    },
);