import { createAsyncThunk } from "@reduxjs/toolkit";
import {invoicesAPI} from "../api";
import {handlerError} from "../../../store/thunkHandlers";
import {setModalMessage} from "../../messages/model/slice";
import {IInvoice, INewInvoice} from "../../../models/iInvoices";
import {filesAPI} from "../../files/api";
import {nestServerPath} from "../../../api";

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

export const fetchGetAllInvoices = createAsyncThunk(
    "invoices/get_all",
    async (_, {dispatch, rejectWithValue}) => {
        try {
            console.log("invoices/get_all")
            return await invoicesAPI.getAll();
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
            return res;
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    },
);



/*export const fetchLinkPositions = createAsyncThunk(
  "fetch_link_positions",
  async (linkPositionDate: ILinkPositions, ThunkAPI) => {
    try {
      const res = await invoicesAPI.linkPosition(linkPositionDate);
      return res;
    } catch (e) {
      return ThunkAPI.rejectWithValue(handlerError(e));
    }
  },
);

export interface IUpdatePaidData {
  invoiceId: string;
  newPaid: IPaid;
}


export interface IUpdateApprovedData {
  invoiceId: string;
  newApproved: IApproved;
}
export const fetchUpdateInvoiceApproved = createAsyncThunk(
  "update_invoice_approved",
  async (updateApprovedData: IUpdateApprovedData, ThunkAPI) => {
    try {
      const res = await invoicesAPI.updateInvoiceApproved(updateApprovedData);
      return res;
    } catch (e) {
      return ThunkAPI.rejectWithValue(handlerError(e));
    }
  },
);
export interface IUpdateCancelData {
  invoiceId: string;
  newCancel: ICancel;
}

export const fetchUpdateInvoiceCancel = createAsyncThunk(
  "update_invoice_cancel",
  async (updateCancelData: IUpdateCancelData, ThunkAPI) => {
    try {
      const res = await invoicesAPI.updateCancelInvoice(updateCancelData);
      return res;
    } catch (e) {
      return ThunkAPI.rejectWithValue(handlerError(e));
    }
  },
);

export interface IFileData {
  file: File;
  updateFile: (name: string, filePatch: string) => void;
  setIsUpdateFileLoading: (isLoading: boolean) => void;
}
export const fetchUploadFile = createAsyncThunk("upload_file", async (fileData: IFileData, ThunkAPI) => {
  try {
    const res = await api.uploadFile(fileData);
    return res;
  } catch (e) {
    return ThunkAPI.rejectWithValue(handlerError(e));
  }
});
export const fetchRemoveFile = createAsyncThunk("remove_file", async (fileName: string, ThunkAPI) => {
  try {
    const res = await api.removeFile(fileName);
    return res;
  } catch (e) {
    return ThunkAPI.rejectWithValue(handlerError(e));
  }
});*/
