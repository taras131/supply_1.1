import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMachineryDoc } from "../../../models/IMachineryDoc";
import { fetchAddMachineryDoc, fetchDeleteMachineryDoc } from "./actions";

interface IMachineryDocsState {
  list: IMachineryDoc[];
  isLoading: boolean;
  current: IMachineryDoc | null;
}

const handlePending = (state: IMachineryDocsState) => {
  state.isLoading = true;
};

const handleRejected = (state: IMachineryDocsState) => {
  state.isLoading = false;
};

const initialState: IMachineryDocsState = {
  list: [],
  isLoading: false,
  current: null,
};

export const MachineryDocsSlice = createSlice({
  name: "machinery_docs_slice",
  initialState,
  reducers: {
    setDocs: (state, action: PayloadAction<IMachineryDoc[]>) => {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddMachineryDoc.fulfilled, (state, action: PayloadAction<IMachineryDoc>) => {
        state.list = [...state.list, action.payload];
        state.isLoading = false;
      })
      .addCase(fetchDeleteMachineryDoc.fulfilled, (state, action: PayloadAction<IMachineryDoc>) => {
        state.list = [...state.list.filter((doc) => doc.id !== action.payload.id)];
        state.isLoading = false;
      })
      .addCase(fetchAddMachineryDoc.pending, handlePending)
      .addCase(fetchAddMachineryDoc.rejected, handleRejected)
      .addCase(fetchDeleteMachineryDoc.pending, handlePending)
      .addCase(fetchDeleteMachineryDoc.rejected, handleRejected);
  },
});

export const { setDocs } = MachineryDocsSlice.actions;
export default MachineryDocsSlice.reducer;
