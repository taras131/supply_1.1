import { createAsyncThunk } from "@reduxjs/toolkit";
import { handlerError } from "../../../store/handleError";
import { companyAPI } from "../api";
import { ICompany } from "../../../models/iCompanies";

export const fetchCheckCompanyById = createAsyncThunk(
  "fetch_check_company_by_id",
  async (company_id: string, ThunkAPI) => {
    try {
      return await companyAPI.checkById(company_id);
    } catch (e) {
      return ThunkAPI.rejectWithValue(handlerError(e));
    }
  },
);

export const fetchUpdateCompany = createAsyncThunk("fetch_update_company", async (company: ICompany, ThunkAPI) => {
  try {
    return await companyAPI.update(company);
  } catch (e) {
    return ThunkAPI.rejectWithValue(handlerError(e));
  }
});
