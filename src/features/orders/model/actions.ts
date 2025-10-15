import {createAsyncThunk} from "@reduxjs/toolkit";
import {INewOrder, IOrder} from "../../../models/iOrders";
import {handlerError} from "../../../store/thunkHandlers";
import {ordersAPI} from "../api";
import {setOrdersPositions} from "../../orders_positions/model/slice";
import {setModalMessage} from "../../messages/model/slice";

export const fetchAddOrder = createAsyncThunk<
    IOrder,
    INewOrder,
    { rejectValue: string }
>(
    "orders/add_new",
    async (order, {rejectWithValue, dispatch}) => {
        try {
            const actualData = new Date().getTime()
            const order_in = {...order, author_date: order.author_date === 0 ? actualData : order.author_date}
            return await ordersAPI.add(order_in);
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    }
);

export const fetchGetAllOrders = createAsyncThunk("orders/get_all", async (_, {
    rejectWithValue, dispatch
}) => {
    try {
        return await ordersAPI.getAll();
    } catch (e) {
        const msg = handlerError(e);
        dispatch(setModalMessage(msg));
        return rejectWithValue(msg);
    }
});

export const fetchGetOrderById = createAsyncThunk("orders/get_by_id",
    async (orderId: string, {dispatch, rejectWithValue}) => {
        try {
            const res = await ordersAPI.getById(orderId);
            const {positions, ...order} = res;
            dispatch(setOrdersPositions(positions));
            return order;
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    });

export const fetchGetOrdersForNewInvoice = createAsyncThunk("orders/get_for_new_invoice", async (_, {
    rejectWithValue, dispatch
}) => {
    try {
        return await ordersAPI.getForNewInvoice();
    } catch (e) {
        const msg = handlerError(e);
        dispatch(setModalMessage(msg));
        return rejectWithValue(msg);
    }
});

export const fetchGetOrdersForInvoice = createAsyncThunk("orders/get_for_invoice", async (invoiceId: string, {
    rejectWithValue, dispatch
}) => {
    try {
        return await ordersAPI.getForInvoice(invoiceId);
    } catch (e) {
        const msg = handlerError(e);
        dispatch(setModalMessage(msg));
        return rejectWithValue(msg);
    }
});

export interface IUpdateApprovedOrderData {
    orderId: string;
    newApproved: boolean;
}

export const fetchUpdateOrder = createAsyncThunk("orders/update",
    async (order: IOrder, {
        rejectWithValue, dispatch
    }) => {
        try {
            return await ordersAPI.update(order);
        } catch (e) {
            const msg = handlerError(e);
            dispatch(setModalMessage(msg));
            return rejectWithValue(msg);
        }
    });


