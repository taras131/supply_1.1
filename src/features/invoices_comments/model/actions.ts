import {createAsyncThunk} from "@reduxjs/toolkit";
import {setMessage} from "../../messages/model/slice";
import {MESSAGE_SEVERITY} from "../../../utils/const";
import {handlerError} from "../../../store/handleError";
import {invoiceCommentAPI} from "../api";
import {IInvoiceComment, INewInvoiceComment} from "../../../models/iInvoiceComment";

export const fetchAddInvoiceComment = createAsyncThunk(
    "invoice_comment/add",
    async (comment: INewInvoiceComment, { rejectWithValue, dispatch }) => {
        try {
            return await invoiceCommentAPI.add(comment);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
            dispatch(
                setMessage({
                    severity: MESSAGE_SEVERITY.error,
                    text: errorMessage || "Не удалось добавить комментарий.",
                }),
            );
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchGetAllInvoiceComment = createAsyncThunk(
    "invoice_comment/get_all",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            return await invoiceCommentAPI.getAll();
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchUpdateInvoiceComment = createAsyncThunk(
    "invoice_comment/update",
    async (comment: IInvoiceComment, { rejectWithValue, dispatch }) => {
        try {
            return await invoiceCommentAPI.update(comment);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
            dispatch(
                setMessage({
                    severity: MESSAGE_SEVERITY.error,
                    text: errorMessage || "Не удалось обновить комментарий.",
                }),
            );
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchDeleteInvoiceComment = createAsyncThunk(
    "invoice_comment/delete",
    async (comment_id: string, { rejectWithValue, dispatch }) => {
        try {
            return await invoiceCommentAPI.delete(comment_id);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
            dispatch(
                setMessage({
                    severity: MESSAGE_SEVERITY.error,
                    text: errorMessage || "Не удалось удалить  комментарий.",
                }),
            );
            return rejectWithValue(handlerError(e));
        }
    },
);