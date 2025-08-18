import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchAddFile, fetchDeleteFile } from "./actions";

export interface IFilesState {
  errorMessage: string;
  isLoading: boolean;
  newFileName: string;
  deletedFileName: string;
}

const initialState: IFilesState = {
  errorMessage: "",
  isLoading: false,
  newFileName: "",
  deletedFileName: "",
};

const handlePending = (state: IFilesState) => {
  state.isLoading = true;
  state.errorMessage = "";
};

const handleRejected = (state: IFilesState, action: any) => {
  state.isLoading = false;
  state.errorMessage = action.payload as string;
};

export const FilesSlice = createSlice({
  name: "files",
  initialState: initialState,
  reducers: {
    resetNewFileName: (state) => {
      state.newFileName = "";
    },
    resetDeletedFileName: (state) => {
      state.deletedFileName = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddFile.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.newFileName = action.payload;
      })
      .addCase(fetchDeleteFile.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.deletedFileName = action.payload;
      })
      .addMatcher((action) => action.type.endsWith("/pending"), handlePending)
      .addMatcher((action) => action.type.endsWith("/rejected"), handleRejected);
  },
});

export const { resetNewFileName, resetDeletedFileName } = FilesSlice.actions;
export default FilesSlice.reducer;
