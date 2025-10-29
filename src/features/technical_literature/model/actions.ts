import {createAsyncThunk} from "@reduxjs/toolkit";
import {filesAPI} from "../../files/api";
import {handlerError} from "../../../store/thunkHandlers";
import {setModalMessage} from "../../messages/model/slice";
import {fetchGetInvoicesStatistics} from "../../invoices/model/actions";
import {INewTechnicalLiterature, ITechnicalLiterature} from "../../../models/ITechnicalLiterature";
import {technicalLiteratureAPI} from "../api";
import {RootState} from "../../../store";

export interface IAddLiteratureData {
    literature: INewTechnicalLiterature;
    file?: File | null;
}

export const fetchAddTechnicalLiterature = createAsyncThunk(
    "technical_literature/add",
    async (invoiceData: IAddLiteratureData, {dispatch, rejectWithValue}) => {
        try {
            const {literature, file} = invoiceData;
            if (file) {
                literature.file_url = await filesAPI.upload(file);
            }
            const res = await technicalLiteratureAPI.add(literature);
            dispatch(fetchGetInvoicesStatistics());
            return res;
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);

export const fetchGetAllTechnicalLiterature = createAsyncThunk(
    "technical_literature/get_all",
    async (_, {dispatch, rejectWithValue}) => {
        try {
            return await technicalLiteratureAPI.getAll();
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);

export const fetchUpdateLiterature = createAsyncThunk(
    "technical_literature/update",
    async (literature: ITechnicalLiterature, {rejectWithValue, dispatch}) => {
        try {
            return await technicalLiteratureAPI.update(literature);
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);

export const fetchDeleteTechnicalLiterature = createAsyncThunk(
    "technical_literature/delete",
    async (id: string, {rejectWithValue, dispatch, getState}) => {
        try {
            const state = getState() as RootState;
            const currentLiterature = state.technicalLiterature.list.find(
                position => position.id === id
            );
            if (!currentLiterature) return "0";
            const removeFile = await filesAPI.delete(currentLiterature.file_url);
            console.log(removeFile)
            // if(!removeFile) return "0";
            await technicalLiteratureAPI.delete(id);
            return id;
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);

