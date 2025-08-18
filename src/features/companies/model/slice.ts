import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICompany } from "../../../models/iCompanies";
import { fetchCheckCompanyById, fetchUpdateCompany } from "./actions";

interface ICompaniesState {
  list: ICompany[];
  isLoading: boolean;
  current: ICompany | null;
}

const handlePending = (state: ICompaniesState) => {
  state.isLoading = true;
};

const handleRejected = (state: ICompaniesState) => {
  state.isLoading = false;
};

const initialState: ICompaniesState = {
  list: [],
  isLoading: false,
  current: null,
};

export const CompaniesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setCompanies: (state, action: PayloadAction<ICompany[]>) => {
      state.list = action.payload;
    },
    setCurrentCompany: (state, action: PayloadAction<ICompany | null>) => {
      state.current = action.payload;
    },
    resetCurrentCompany: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheckCompanyById.fulfilled, (state, action: PayloadAction<ICompany>) => {
        state.current = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUpdateCompany.fulfilled, (state, action: PayloadAction<ICompany>) => {
        state.current = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCheckCompanyById.pending, handlePending)
      .addCase(fetchCheckCompanyById.rejected, handleRejected)
      .addCase(fetchUpdateCompany.pending, handlePending)
      .addCase(fetchUpdateCompany.rejected, handleRejected);
  },
});

export const { setCompanies, setCurrentCompany, resetCurrentCompany } = CompaniesSlice.actions;
export default CompaniesSlice.reducer;
