import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IMachineryComment } from "../../../models/IMachineryComment";
import {
  fetchAddMachineryComment,
  fetchDeleteMachineryComment,
  fetchGetAllMachineryComment,
  fetchUpdateMachineryComment,
} from "./actions";

interface IMachineryCommentsState {
  list: IMachineryComment[];
  isLoading: boolean;
  current: IMachineryComment | null;
}

const handlePending = (state: IMachineryCommentsState) => {
  state.isLoading = true;
};

const handleRejected = (state: IMachineryCommentsState) => {
  state.isLoading = false;
};

const initialState: IMachineryCommentsState = {
  list: [],
  isLoading: false,
  current: null,
};

export const MachineryCommentsSlice = createSlice({
  name: "machinery_comments_slice",
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<IMachineryComment[]>) => {
      state.list = action.payload.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddMachineryComment.fulfilled, (state, action: PayloadAction<IMachineryComment>) => {
        state.list = [action.payload, ...state.list];
        state.isLoading = false;
      })
      .addCase(fetchGetAllMachineryComment.fulfilled, (state, action: PayloadAction<IMachineryComment[]>) => {
        state.list = action.payload.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        state.isLoading = false;
      })
      .addCase(fetchUpdateMachineryComment.fulfilled, (state, action: PayloadAction<IMachineryComment>) => {
        state.list = [...state.list.map((comment) => (comment.id === action.payload.id ? action.payload : comment))];
        state.isLoading = false;
      })
      .addCase(fetchDeleteMachineryComment.fulfilled, (state, action: PayloadAction<IMachineryComment>) => {
        state.list = [...state.list.filter((doc) => doc.id !== action.payload.id)];
        state.isLoading = false;
      })
      .addCase(fetchAddMachineryComment.pending, handlePending)
      .addCase(fetchAddMachineryComment.rejected, handleRejected)
      .addCase(fetchGetAllMachineryComment.pending, handlePending)
      .addCase(fetchGetAllMachineryComment.rejected, handleRejected)
      .addCase(fetchUpdateMachineryComment.pending, handlePending)
      .addCase(fetchUpdateMachineryComment.rejected, handleRejected)
      .addCase(fetchDeleteMachineryComment.pending, handlePending)
      .addCase(fetchDeleteMachineryComment.rejected, handleRejected);
  },
});

export const { setComments } = MachineryCommentsSlice.actions;
export default MachineryCommentsSlice.reducer;
