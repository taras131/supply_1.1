import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICurrentMachinery, IMachinery } from "../../../models/iMachinery";
import {
  fetchAddMachinery,
  fetchDeleteMachineryPhoto,
  fetchGetAllMachinery,
  fetchGetMachineryById,
  fetchUpdateMachinery,
} from "./actions";
import { sortMachineryList } from "../utils/services";

interface IMachineryState {
  list: IMachinery[];
  current: ICurrentMachinery | null;
  isLoading: boolean;
  errorMessage: string;
  wsConnected: boolean;
  wsMessage: string | null;
}

const initialState: IMachineryState = {
  list: [],
  current: null,
  isLoading: false,
  errorMessage: "",
  wsConnected: false,
  wsMessage: null,
};

const handlePending = (state: IMachineryState) => {
  state.isLoading = true;
  state.errorMessage = "";
};

const handleRejected = (state: any, action: any) => {
  state.isLoading = false;
  state.errorMessage = action.payload as string;
};

export const MachinerySlice = createSlice({
  name: "machinery",
  initialState,
  reducers: {
    wsConnected: (state) => {
      state.wsConnected = true;
    },
    wsDisconnected: (state) => {
      state.wsConnected = false;
    },
    wsMessageReceived: (state, action: PayloadAction<any>) => {
      state.wsMessage = action.payload;
    },
    updateMachinery(state, action: PayloadAction<IMachinery | ICurrentMachinery>) {
      state.list = state.list.map((machinery) => (machinery.id === action.payload.id ? action.payload : machinery));
    },
    updateMachineryList: (state, action: PayloadAction<IMachinery[]>) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddMachinery.fulfilled, (state, action: PayloadAction<IMachinery>) => {
        state.list = [...state.list, action.payload];
        state.isLoading = false;
      })
      .addCase(fetchGetAllMachinery.fulfilled, (state, action: PayloadAction<IMachinery[]>) => {
        state.list = sortMachineryList(action.payload);
        state.isLoading = false;
      })
      .addCase(fetchGetMachineryById.fulfilled, (state, action: PayloadAction<ICurrentMachinery>) => {
        state.isLoading = false;
        state.current = action.payload;
      })
      .addCase(fetchUpdateMachinery.fulfilled, (state, action: PayloadAction<ICurrentMachinery>) => {
        state.isLoading = false;
        state.current = action.payload;
        state.list = [
          ...state.list.map((machinery) => (machinery.id === action.payload.id ? action.payload : machinery)),
        ];
      })
      .addCase(fetchDeleteMachineryPhoto.rejected, handleRejected)
      .addMatcher((action) => action.type.endsWith("/pending"), handlePending)
      .addMatcher((action) => action.type.endsWith("/rejected"), handleRejected);
  },
});

export const { updateMachineryList, wsConnected, wsDisconnected, wsMessageReceived } = MachinerySlice.actions;
export default MachinerySlice.reducer;
