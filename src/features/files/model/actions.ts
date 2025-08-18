import { createAsyncThunk } from "@reduxjs/toolkit";
import { MESSAGE_SEVERITY } from "../../../utils/const";
import { handlerError } from "../../../store/handleError";
import { filesAPI } from "../api";
import { setMessage } from "../../messages/model/slice";

export const fetchAddFile = createAsyncThunk(
  "fetch_add_file",
  async (file: File, { rejectWithValue, dispatch }) => {
    try {
      const res = await filesAPI.upload(file);
      return res.filename;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
      dispatch(
        setMessage({
          severity: MESSAGE_SEVERITY.error,
          text: errorMessage || "Не удалось добавить файл.",
        }),
      );
      return rejectWithValue(handlerError(e));
    }
  },
);

export const fetchDeleteFile = createAsyncThunk(
  "fetch_delete_file",
  async (deletePhoto: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await filesAPI.delete(deletePhoto);
      return res.filename;
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
      dispatch(
        setMessage({
          severity: MESSAGE_SEVERITY.error,
          text: errorMessage || "Не удалось добавить файл.",
        }),
      );
      return rejectWithValue(handlerError(e));
    }
  },
);
