import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IOrder} from "../../../models/iOrders";
import {
    fetchAddOrder,
    fetchGetAllOrders,
    fetchGetOrderById,
    fetchGetOrdersForInvoice, fetchGetOrdersForNewInvoice,
    fetchUpdateOrder
} from "./actions";

interface IOrdersState {
    list: IOrder[];
    isLoading: boolean;
    current: IOrder | null;
}

const initialState: IOrdersState = {
    list: [],
    isLoading: false,
    current: null,
};

export const OrdersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<IOrder[]>) => {
            state.list = action.payload;
        },
        setOrdersLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setCurrentOrder: (state, action: PayloadAction<IOrder>) => {
            state.current = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddOrder.fulfilled, (state, action: PayloadAction<IOrder>) => {
                state.list = [...state.list, action.payload];
                state.isLoading = false;
            })
            .addCase(fetchGetAllOrders.fulfilled, (state, action: PayloadAction<IOrder []>) => {
                state.list = action.payload.slice().sort((a, b) => (
                    b.author_date - a.author_date
                ));
                state.isLoading = false;
            })
            .addCase(fetchGetOrdersForNewInvoice.fulfilled, (state, action: PayloadAction<IOrder []>) => {
                state.list = action.payload.slice().sort((a, b) => (
                    b.author_date - a.author_date
                ));
                state.isLoading = false;
            })
            .addCase(fetchGetOrdersForInvoice.fulfilled, (state, action: PayloadAction<IOrder []>) => {
                state.list = action.payload.slice().sort((a, b) => (
                    b.author_date - a.author_date
                ));
                state.isLoading = false;
            })
            .addCase(fetchGetOrderById.fulfilled, (state, action: PayloadAction<IOrder>) => {
                state.current = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchUpdateOrder.fulfilled, (state, action: PayloadAction<IOrder>) => {
                state.current = action.payload;
                state.isLoading = false;
            })
    },
});

export const {
    setOrders,
    setOrdersLoading,
    setCurrentOrder,
} = OrdersSlice.actions;

export default OrdersSlice.reducer;
