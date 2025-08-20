import {createAsyncThunk} from "@reduxjs/toolkit";
import {INewOrder, IOrder} from "../../../models/iOrders";
import {handlerError} from "../../../store/thunkHandlers";
import {ordersAPI} from "../api";
import {setOrdersPositions} from "../../orders_positions/model/slice";

export const fetchAddOrder = createAsyncThunk("orders/add_new",
    async (order: INewOrder, ThunkAPI) => {
        try {
            const res = await ordersAPI.add(order);
            return res;
        } catch (e) {
            console.log(e);
            return ThunkAPI.rejectWithValue(handlerError(e));
        }
    });

export const fetchGetAllOrders = createAsyncThunk("orders/get_all", async (_, ThunkAPI) => {
    try {
        const res = await ordersAPI.getAll();
        return res;
    } catch (e) {
        return ThunkAPI.rejectWithValue(handlerError(e));
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
        return rejectWithValue(handlerError(e));
    }
});

export interface IUpdateApprovedOrderData {
    orderId: string;
    newApproved: boolean;
}

/*export const fetchUpdateOrderApproved = createAsyncThunk(
  "update_order_approved",
  async (updateApprovedOrderData: IUpdateApprovedOrderData, ThunkAPI) => {
    try {
      const res = await ordersAPI.updateOrderApproved(updateApprovedOrderData);
      return res;
    } catch (e) {
      return ThunkAPI.rejectWithValue(handlerError(e));
    }
  },
);*/

/*export const fetchUpdateOrder = createAsyncThunk("update_order", async (order: IOrder, ThunkAPI) => {
  try {
    const res = await ordersAPI.updateOrder(order);
    return res;
  } catch (e) {
    return ThunkAPI.rejectWithValue(handlerError(e));
  }
});*/
