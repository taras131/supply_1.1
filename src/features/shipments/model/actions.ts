import {createAsyncThunk} from "@reduxjs/toolkit";
import {INewShipments} from "../../../models/iShipments";
import {shipmentsAPI} from "../api";
import {handlerError} from "../../../store/handleError";
import {setModalMessage} from "../../messages/model/slice";

export const fetchAddShipment = createAsyncThunk("shipments/add",
    async (shipment: INewShipments, {dispatch, rejectWithValue}) => {
        try {
            console.log(shipment.author_date)
            const safeAuthorDate =
                typeof shipment.author_date === 'number'
                && Number.isFinite(shipment.author_date) && shipment.author_date > 0
                    ? shipment.author_date
                    : Date.now(); // дефолт, если не пришло валидное значение
            const shipment_in = {
                ...shipment,
                lading_file_path: shipment.lading_file_path ?? null,
                author_date: safeAuthorDate,
                receiving_author_id: shipment.receiving_author_id ? shipment.receiving_author_id : null,
                author_id: shipment.author_id ? shipment.author_id : null,
            }
            return await shipmentsAPI.add(shipment_in);
        } catch (e) {
            console.error(e);
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    });

export const fetchGetAllShipment = createAsyncThunk("shipments/get_all",
    async (_, {dispatch, rejectWithValue}) => {
        try {
            return await shipmentsAPI.getAll();
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    });