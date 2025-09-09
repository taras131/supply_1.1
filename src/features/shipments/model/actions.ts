import {createAsyncThunk} from "@reduxjs/toolkit";
import {INewShipments, IShipments} from "../../../models/iShipments";
import {shipmentsAPI} from "../api";
import {handlerError} from "../../../store/handleError";
import {setModalMessage} from "../../messages/model/slice";
import {filesAPI} from "../../files/api";
import {nestServerPath} from "../../../api";

interface CreateShipmentDto {
    shipment: INewShipments,
    photoFile?: File | null,
    ladingFile?: File | null,
}

export const fetchAddShipment = createAsyncThunk("shipments/add",
    async (dto: CreateShipmentDto, {dispatch, rejectWithValue}) => {
        try {
            const {shipment, photoFile, ladingFile} = dto;
            const safeAuthorDate =
               Number.isFinite(shipment.author_date) && shipment.author_date > 0
                    ? shipment.author_date
                    : Date.now();
            const shipment_in = {
                ...shipment,
                lading_file_path: shipment.lading_file_path ?? null,
                author_date: safeAuthorDate,
                receiving_author_id: shipment.receiving_author_id ? shipment.receiving_author_id : null,
                author_id: shipment.author_id ? shipment.author_id : null,
            }
            if(photoFile){
                const res = await filesAPI.upload(photoFile);
                shipment_in.photo_file_path = `${nestServerPath}/static/${res}`;
            }
            if(ladingFile){
                const res = await filesAPI.upload(ladingFile);
                shipment_in.lading_file_path = `${nestServerPath}/static/${res}`;
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

export const fetchUpdateShipment = createAsyncThunk("shipments/update",
    async (shipment: IShipments, {dispatch, rejectWithValue}) => {
        try {
            return await shipmentsAPI.update(shipment);
        } catch (e) {
            console.log(e)
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    });

export const fetchUpdateShipmentInvoices = createAsyncThunk("shipments/update_shipment_invoices",
    async (shipment: IShipments, {dispatch, rejectWithValue}) => {
        try {
            return await shipmentsAPI.updateShipmentInvoices(shipment);
        } catch (e) {
            console.log(e)
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    });