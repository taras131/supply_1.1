import {createAsyncThunk} from "@reduxjs/toolkit";
import {filesAPI} from "../../files/api";
import {fileServerPath} from "../../../api";
import {handlerError} from "../../../store/thunkHandlers";
import {setModalMessage} from "../../messages/model/slice";
import {fetchGetInvoicesStatistics} from "../../invoices/model/actions";
import {INewTechnicalLiterature} from "../../../models/ITechnicalLiterature";
import {technicalLiteratureAPI} from "../api";

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
                const uploadedFile = await filesAPI.upload(file);
                literature.file_url = `${fileServerPath}/${uploadedFile}`
            }

            const res = await technicalLiteratureAPI.add(literature);
            dispatch(fetchGetInvoicesStatistics());
            return res;
        } catch (e) {
            console.log(e)
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