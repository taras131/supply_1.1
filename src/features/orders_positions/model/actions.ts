import { createAsyncThunk } from "@reduxjs/toolkit";
import { handlerError } from "../../../store/handleError";
import { ordersPositionsAPI } from "../api";

export const fetchGetAllOrdersPositions = createAsyncThunk(
  "orders_positions/get_all",
  async (_, { rejectWithValue }) => {
    try {
      return await ordersPositionsAPI.getAll();
    } catch (e) {
      return rejectWithValue(handlerError(e));
    }
  },
);
