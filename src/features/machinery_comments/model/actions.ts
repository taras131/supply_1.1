import { createAsyncThunk } from "@reduxjs/toolkit";
import { setMessage } from "../../messages/model/slice";
import { MESSAGE_SEVERITY } from "../../../utils/const";
import { handlerError } from "../../../store/handleError";
import { machineryCommentAPI } from "../api";
import { IMachineryComment, INewMachineryComment } from "../../../models/IMachineryComment";

export const fetchAddMachineryComment = createAsyncThunk(
  "machinery_comment/add",
  async (comment: INewMachineryComment, { rejectWithValue, dispatch }) => {
    try {
      return await machineryCommentAPI.add(comment);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
      dispatch(
        setMessage({
          severity: MESSAGE_SEVERITY.error,
          text: errorMessage || "Не удалось добавить заметку.",
        }),
      );
      return rejectWithValue(handlerError(e));
    }
  },
);

export const fetchGetAllMachineryComment = createAsyncThunk(
  "machinery_comment/get_all",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      return await machineryCommentAPI.getAll();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
      dispatch(
        setMessage({
          severity: MESSAGE_SEVERITY.error,
          text: errorMessage || "Не удалось добавить заметку.",
        }),
      );
      return rejectWithValue(handlerError(e));
    }
  },
);

export const fetchUpdateMachineryComment = createAsyncThunk(
  "machinery_comment/update",
  async (comment: IMachineryComment, { rejectWithValue, dispatch }) => {
    try {
      return await machineryCommentAPI.update(comment);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
      dispatch(
        setMessage({
          severity: MESSAGE_SEVERITY.error,
          text: errorMessage || "Не удалось добавить машину.",
        }),
      );
      return rejectWithValue(handlerError(e));
    }
  },
);

export const fetchDeleteMachineryComment = createAsyncThunk(
  "machinery_comment/delete",
  async (comment_id: string, { rejectWithValue, dispatch }) => {
    try {
      return await machineryCommentAPI.delete(comment_id);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Неизвестная ошибка";
      dispatch(
        setMessage({
          severity: MESSAGE_SEVERITY.error,
          text: errorMessage || "Не удалось удалить заметку.",
        }),
      );
      return rejectWithValue(handlerError(e));
    }
  },
);
