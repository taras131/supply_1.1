import {createSlice, isFulfilled, isPending, isRejected, PayloadAction} from "@reduxjs/toolkit";
import {IInvoice} from "../../../models/iInvoices";
import {ISelectedOrderPosition} from "../../../models/IOrdersPositions";
import {
    fetchAddInvoice,
    fetchGetAllInvoices,
    fetchGetInvoiceById,
    fetchUpdateInvoice,
    fetchUploadInvoice,
    fetchUploadPayment
} from "./actions";

interface ISelectedOrderPositionData {
    orderId: string;
    positionId: number;
}

const handledThunks = [
    fetchAddInvoice,
    fetchGetAllInvoices,
    fetchUpdateInvoice,
    fetchGetInvoiceById,
    fetchUploadInvoice,
    fetchUploadPayment,
] as const;

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
            })
            .addCase(fetchGetAllInvoices.fulfilled, (state, action: PayloadAction<IInvoice []>) => {
                state.list = action.payload.sort((a, b) => {
                    return b.author_date - a.author_date
                });
            })
            .addCase(fetchUpdateInvoice.fulfilled, (state, action: PayloadAction<IInvoice>) => {
                state.current = action.payload;
                state.list = [...state.list.map(invoice => invoice.id === action.payload.id ? action.payload : invoice)];
            })
            .addCase(fetchGetInvoiceById.fulfilled, (state, action: PayloadAction<IInvoice>) => {
                state.current = action.payload;
            })
            .addMatcher(isPending(...handledThunks), (state) => {
                state.isLoading = true;
            })
            .addMatcher(isRejected(...handledThunks), (state) => {
                state.isLoading = false;
            })
            .addMatcher(isFulfilled(...handledThunks), (state) => {
                state.isLoading = false;
            });
    },
});

export const {setInvoices, setSelectedOrderPosition, resetSelectedOrderPosition} = InvoicesSlice.actions;

export default InvoicesSlice.reducer;
