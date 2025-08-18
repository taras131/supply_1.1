import { createAsyncThunk } from "@reduxjs/toolkit";
import {INewOrder, IOrder} from "../../../models/iOrders";
import {handlerError} from "../../../store/thunkHandlers";
import {ordersAPI} from "../api";

export const fetchAddOrder = createAsyncThunk("fetch_add_shipment", async (order: INewOrder, ThunkAPI) => {
  try {
    const res = await ordersAPI.addOrder(order);
    return res;
  } catch (e) {
    return ThunkAPI.rejectWithValue(handlerError(e));
  }
});

export const fetchGetAllOrders = createAsyncThunk("orders/get_all", async (_, ThunkAPI) => {
  try {
    const res = await ordersAPI.getAll();
    console.log(res);
    return res;
  } catch (e) {
    return ThunkAPI.rejectWithValue(handlerError(e));
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
