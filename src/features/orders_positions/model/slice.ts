import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IOrderPosition} from "../../../models/IOrdersPositions";
import {fetchCreateOrdersPositions, fetchGetAllOrdersPositions, fetchUpdateOrdersPositions} from "./actions";

interface IOrdersPositionsState {
    list: IOrderPosition[];
    isLoading: boolean;
    current: IOrderPosition | null;
}

const initialState: IOrdersPositionsState = {
    list: [],
    isLoading: false,
    current: null,
};

export const OrderPositionsSlice = createSlice({
    name: "orders_positions",
    initialState,
    reducers: {
        setOrdersPositions: (state, action: PayloadAction<IOrderPosition[]>) => {
            state.list = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGetAllOrdersPositions.fulfilled, (state, action: PayloadAction<IOrderPosition[]>) => {
                state.list = action.payload
                state.isLoading = false;
            })
            .addCase(fetchUpdateOrdersPositions.fulfilled, (state, action: PayloadAction<IOrderPosition>) => {
                state.list = [...state.list.map(position => position.id === action.payload.id
                    ? action.payload
                    : position)]
                state.isLoading = false;
            })
            .addCase(fetchCreateOrdersPositions.fulfilled, (state, action: PayloadAction<IOrderPosition>) => {
                state.list = [...state.list, action.payload]
                state.isLoading = false;
            })
    },
});

export const {setOrdersPositions} = OrderPositionsSlice.actions;
export default OrderPositionsSlice.reducer;
