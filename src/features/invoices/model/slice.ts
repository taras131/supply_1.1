import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IInvoice} from "../../../models/iInvoices";
import {ISelectedOrderPosition} from "../../../models/IOrdersPositions";
import {fetchAddInvoice, fetchGetAllInvoices, fetchUpdateInvoice} from "./actions";

interface ISelectedOrderPositionData {
    orderId: string;
    positionId: number;
}

interface IInvoiceState {
    list: IInvoice[];
    current: IInvoice | null;
    isLoading: boolean;
    selectedPosition: ISelectedOrderPosition;
}

const initialState: IInvoiceState = {
    list: [],
    current: null,
    isLoading: false,
    selectedPosition: {},
};

export const InvoicesSlice = createSlice({
    name: "invoices",
    initialState,
    reducers: {
        setInvoices: (state, action: PayloadAction<IInvoice[]>) => {
            state.list = action.payload;
        },
        setSelectedOrderPosition: (state, action: PayloadAction<ISelectedOrderPositionData>) => {
            const {orderId, positionId} = action.payload;
            if (state.selectedPosition[orderId]) {
                if (state.selectedPosition[orderId].find((item) => item === positionId)) {
                    state.selectedPosition = {
                        ...state.selectedPosition,
                        [orderId]: [...state.selectedPosition[orderId].filter((item) => item !== positionId)],
                    };
                } else {
                    state.selectedPosition = {
                        ...state.selectedPosition,
                        [orderId]: [...state.selectedPosition[orderId], positionId],
                    };
                }
            } else {
                state.selectedPosition = {...state.selectedPosition, [orderId]: [positionId]};
            }
        },
        resetSelectedOrderPosition: (state) => {
            state.selectedPosition = {};
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchAddInvoice.fulfilled, (state, action: PayloadAction<IInvoice>) => {
                state.list = [...state.list, action.payload];
                state.isLoading = false;
            })
            .addCase(fetchGetAllInvoices.fulfilled, (state, action: PayloadAction<IInvoice []>) => {
                state.list = action.payload.sort((a, b) => {
                    return a.author_date - b.author_date
                });
                state.isLoading = false;
            })
            .addCase(fetchUpdateInvoice.fulfilled, (state, action: PayloadAction<IInvoice>) => {
                state.list = [...state.list.map(invoice => invoice.id === action.payload.id ? action.payload : invoice)];
                state.isLoading = false;
            })
            .addCase(fetchAddInvoice.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchGetAllInvoices.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUpdateInvoice.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAddInvoice.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchGetAllInvoices.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(fetchUpdateInvoice.rejected, (state) => {
                state.isLoading = false;
            })
    },
});

export const {setInvoices, setSelectedOrderPosition, resetSelectedOrderPosition} = InvoicesSlice.actions;

export default InvoicesSlice.reducer;
