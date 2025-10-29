import {createAsyncThunk} from "@reduxjs/toolkit";
import {handlerError} from "../../../store/handleError";
import {companyAPI} from "../api";
import {ICompany} from "../../../models/iCompanies";
import {RootState} from "../../../store";
import {filesAPI} from "../../files/api";

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

interface IUploadPhoto {
    company: ICompany;
    file: File;
}

export const fetchUploadCompanyPhoto = createAsyncThunk<ICompany, IUploadPhoto, { state: RootState }>(
    "company/upload_photo",
    async (uploadData: IUploadPhoto, {rejectWithValue, dispatch}) => {
        try {
            const {file, company} = uploadData;
            if (company.logo_path) {
                await filesAPI.delete(company.logo_path);
            }
            const res = await filesAPI.upload(file);
            if (!res) return;
            const updatedCompany = {...company, logo_path: res};
            return dispatch(fetchUpdateCompany(updatedCompany)).unwrap();
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);

export const fetchRemoveCompanyPhoto = createAsyncThunk(
    "company/remove_photo",
    async (company: ICompany, {rejectWithValue, dispatch}) => {
        try {
            await filesAPI.delete(company.logo_path);
            const updatedCompany = {
                ...company,
                logo_path: "",
            };
            return await dispatch(fetchUpdateCompany(updatedCompany)).unwrap();
        } catch (e) {
            return rejectWithValue(handlerError(e));
        }
    },
);
