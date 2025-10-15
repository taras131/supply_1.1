import {createAsyncThunk} from "@reduxjs/toolkit";
import {invoicesAPI} from "../api";
import {handlerError} from "../../../store/thunkHandlers";
import {setModalMessage} from "../../messages/model/slice";
import {IInvoice, INewInvoice} from "../../../models/iInvoices";
import {filesAPI} from "../../files/api";
import {fileServerPath} from "../../../api";
import {setOrdersPositions} from "../../orders_positions/model/slice";
import {setShipments} from "../../shipments/model/slice";
import {IShipments} from "../../../models/iShipments";

function mergeInvoicesPreserveLocal(
    oldArr: IInvoice[],
    newArr: IInvoice[],
): IInvoice[] {
    const byId = new Map<string, IInvoice>();
    // Сначала кладём новые (серверные) — это база истины
    for (const n of newArr) byId.set(n.id, n);
    // Затем дополняем локальными полями из старых
    for (const o of oldArr) {
        const cur = byId.get(o.id);
        if (cur) {
            byId.set(o.id, {
                ...cur,
                // Сохраняем локальные поля (добавьте сюда всё нужное)
                volume: o.volume ?? cur.volume,
                // checked: o.checked ?? cur.checked,
                // ...
            });
        } else {
            // Если в новых нет — оставим старый как есть
            byId.set(o.id, o);
        }
    }
    return Array.from(byId.values());
}

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
                invoice.invoice_file_link = `${fileServerPath}/${uploadedFile}`
            }
            if (invoice.author_date === 0) {
                invoice.author_date = new Date().getTime()
            }
            const res = await invoicesAPI.add(invoice);
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

export const fetchGetInvoicesForNewShipment = createAsyncThunk(
    "invoices/get_for_new_shipment",
    async (old_invoices: IInvoice [] = [], {dispatch, rejectWithValue}) => {
        try {
            const res = await invoicesAPI.getForNewShipment();
            return mergeInvoicesPreserveLocal(old_invoices, res);
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
            const {positions, shipment_invoices, ...res} = await invoicesAPI.getById(id);
            if (positions) {
                dispatch(setOrdersPositions(positions));
            }
            if (shipment_invoices) {
                const shipments: IShipments[] = [];
                shipment_invoices.forEach((si: any) => {
                    const {shipment, ...shipment_invoices} = si
                    shipments.push({...shipment, shipment_invoices: [shipment_invoices]});
                })
                dispatch(setShipments(shipments));
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
            const res = await invoicesAPI.update(invoice);
            dispatch(fetchGetInvoicesStatistics());
            return res;
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
                invoice.paid_payment_order_file_link = `${fileServerPath}/${uploadedFile}`
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
                invoice_in.invoice_file_link = `${fileServerPath}/${uploadedFile}`
            }
            return await dispatch(fetchUpdateInvoice(invoice_in)).unwrap();
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);

export const fetchGetInvoicesStatistics = createAsyncThunk(
    "invoices/get_statistics",
    async (_, {dispatch, rejectWithValue}) => {
        try {
            return await invoicesAPI.getStatistics();
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);