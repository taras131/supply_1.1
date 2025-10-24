import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IInvoiceComment} from "../../../models/iInvoiceComment";
import {
    fetchAddInvoiceComment,
    fetchDeleteInvoiceComment,
    fetchGetAllInvoiceComment,
    fetchUpdateInvoiceComment
} from "./actions";

interface IInvoicesCommentsState {
    list: IInvoiceComment[];
    isLoading: boolean;
    current: IInvoiceComment | null;
}

const handlePending = (state: IInvoicesCommentsState) => {
    state.isLoading = true;
};

const handleRejected = (state: IInvoicesCommentsState) => {
    state.isLoading = false;
};

const initialState: IInvoicesCommentsState = {
    list: [],
    isLoading: false,
    current: null,
};

export const InvoicesCommentsSlice = createSlice({
    name: "invoices_comments_slice",
    initialState,
    reducers: {
        setInvoicesComments: (state, action: PayloadAction<IInvoiceComment[]>) => {
            state.list = action.payload.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddInvoiceComment.fulfilled, (state, action: PayloadAction<IInvoiceComment>) => {
                state.list = [action.payload, ...state.list];
                state.isLoading = false;
            })
            .addCase(fetchGetAllInvoiceComment.fulfilled, (state, action: PayloadAction<IInvoiceComment[]>) => {
                state.list = action.payload.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                state.isLoading = false;
            })
            .addCase(fetchUpdateInvoiceComment.fulfilled, (state, action: PayloadAction<IInvoiceComment>) => {
                state.list = [...state.list.map((comment) => (comment.id === action.payload.id ? action.payload : comment))];
                state.isLoading = false;
            })
            .addCase(fetchDeleteInvoiceComment.fulfilled, (state, action: PayloadAction<IInvoiceComment>) => {
                state.list = [...state.list.filter((doc) => doc.id !== action.payload.id)];
                state.isLoading = false;
            })
            .addCase(fetchAddInvoiceComment.pending, handlePending)
            .addCase(fetchAddInvoiceComment.rejected, handleRejected)
            .addCase(fetchGetAllInvoiceComment.pending, handlePending)
            .addCase(fetchGetAllInvoiceComment.rejected, handleRejected)
            .addCase(fetchUpdateInvoiceComment.pending, handlePending)
            .addCase(fetchUpdateInvoiceComment.rejected, handleRejected)
            .addCase(fetchDeleteInvoiceComment.pending, handlePending)
            .addCase(fetchDeleteInvoiceComment.rejected, handleRejected);
    },
});

export const { setInvoicesComments } = InvoicesCommentsSlice.actions;
export default InvoicesCommentsSlice.reducer;
