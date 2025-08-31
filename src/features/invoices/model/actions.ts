import {createAsyncThunk} from "@reduxjs/toolkit";
import {invoicesAPI} from "../api";
import {handlerError} from "../../../store/thunkHandlers";
import {setModalMessage} from "../../messages/model/slice";
import {IInvoice, INewInvoice} from "../../../models/iInvoices";
import {filesAPI} from "../../files/api";
import {nestServerPath} from "../../../api";
import {setOrdersPositions} from "../../orders_positions/model/slice";

/*export interface ILinkPositions {
  selectedPosition: ISelectedOrderPosition;
  orders: IOrder[];
  invoiceId: string;
}
*/
export interface IAddInvoiceData {
    invoice: INewInvoice;
    file?: File | null;
}

export const fetchAddInvoice = createAsyncThunk(
    "invoices/add",
    async (invoiceData: IAddInvoiceData, {dispatch, rejectWithValue}) => {
        try {
            const {invoice, file} = invoiceData;
            if (file) {
                const uploadedFile = await filesAPI.upload(file);
                invoice.invoice_file_link = `${nestServerPath}/static/${uploadedFile}`
            }
            return await invoicesAPI.add(invoice);
        } catch (e) {
            console.log(e)
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);

export type TInvoiceFilter = "all" | "only_no_paid" | "only_cancel";

export const fetchGetAllInvoices = createAsyncThunk(
    "invoices/get_all",
    async (filter: TInvoiceFilter = "all", {dispatch, rejectWithValue}) => {
        try {
            return await invoicesAPI.getAll(filter);
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);

export const fetchGetInvoiceById = createAsyncThunk(
    "invoices/get_by_id",
    async (id: string, {dispatch, rejectWithValue}) => {
        try {
            const {positions, ...res} = await invoicesAPI.getById(id);
            if (positions) {
                dispatch(setOrdersPositions(positions));
            }
            return res;
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);

export const fetchUpdateInvoice = createAsyncThunk(
    "invoices/update",
    async (invoice: IInvoice, {dispatch, rejectWithValue}) => {
        try {
            return await invoicesAPI.update(invoice);
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);

interface IUploadPaymentData {
    invoice: IInvoice;
    file: File;
}

export const fetchUploadPayment = createAsyncThunk(
    "invoices/upload_payment",
    async (uploadData: IUploadPaymentData, {dispatch, rejectWithValue}) => {
        try {
            const {invoice, file} = uploadData;
            if (invoice.paid_payment_order_file_link) {
                try {
                    const fileName = invoice.paid_payment_order_file_link.split("/").reverse()[0];
                    await filesAPI.delete(fileName);
                } catch {
                    /*ignore*/
                }
            }
            if (file) {
                const uploadedFile = await filesAPI.upload(file);
                invoice.paid_payment_order_file_link = `${nestServerPath}/static/${uploadedFile}`
            }
            return await dispatch(fetchUpdateInvoice(invoice)).unwrap();
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);

export const fetchDeletePayment = createAsyncThunk(
    "invoices/delete_payment",
    async (invoice: IInvoice, {dispatch, rejectWithValue}) => {
        try {
            if (invoice.paid_payment_order_file_link) {
                try {
                    const fileName = invoice.paid_payment_order_file_link.split("/").reverse()[0];
                    await filesAPI.delete(fileName);
                } catch {
                    /*ignore*/
                }
            }
            return await dispatch(fetchUpdateInvoice({
                ...invoice,
                paid_payment_order_file_link: "",
                paid_is_paid: false,
                paid_date: 0,
                paid_user_id: null,
                paid_user: null,
            })).unwrap();
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);

interface IUploadInvoiceData {
    invoice: IInvoice;
    file: File;
}

export const fetchUploadInvoice = createAsyncThunk(
    "invoices/add",
    async (uploadData: IUploadInvoiceData, {dispatch, rejectWithValue}) => {
        try {
            const {invoice, file} = uploadData;
            if (invoice.invoice_file_link) {
                try {
                    console.log(invoice.invoice_file_link)
                    const fileName = invoice.invoice_file_link.split("/").reverse()[0];
                    const res = await filesAPI.delete(fileName);
                    console.log(res)
                } catch {
                    /*ignore*/
                }
            }
            const invoice_in = {...invoice}
            if (file) {
                const uploadedFile = await filesAPI.upload(file);
                console.log(uploadedFile)
                invoice_in.invoice_file_link = `${nestServerPath}/static/${uploadedFile}`
            }
            return await dispatch(fetchUpdateInvoice(invoice_in)).unwrap();
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);