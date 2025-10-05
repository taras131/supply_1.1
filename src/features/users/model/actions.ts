import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "../../../models/IUser";
import { thunkHandlers } from "../../../store/thunkHandlers";
import { filesAPI } from "../../files/api";
import { handlerError } from "../../../store/handleError";
import { userAPI } from "../api";
import { RootState } from "../../../store";

export const fetchGetAllUsers = createAsyncThunk("fetch_get_all_users", async (_, { dispatch, rejectWithValue }) => {
  try {
    return await userAPI.getAll();
  } catch (e) {
    return rejectWithValue(thunkHandlers.error(e, dispatch));
  }
});

export const fetchUpdateUser = createAsyncThunk(
  "fetch_update_user",
  async (updateData: IUser, { dispatch, rejectWithValue }) => {
    try {
      return await userAPI.update(updateData);
    } catch (e) {
      return rejectWithValue(thunkHandlers.error(e, dispatch));
    }
  },
);

interface IUploadPhoto {
  user: IUser;
  file: File;
}

export const fetchUploadUserPhoto = createAsyncThunk<IUser, IUploadPhoto, { state: RootState }>(
  "fetch_update_user_photo",
  async (uploadData: IUploadPhoto, { rejectWithValue, dispatch }) => {
    try {
      const { file, user } = uploadData;
      console.log(user);
      if (user.avatar_path) {
        await filesAPI.delete(user.avatar_path);
      }
      const res = await filesAPI.upload(file);
      if (!res) return;
      const updatedUser = { ...user, avatar_path: res };
      return dispatch(fetchUpdateUser(updatedUser)).unwrap();
    } catch (e) {
      return rejectWithValue(handlerError(e));
    }
  },
);

export const fetchRemoveUserPhoto = createAsyncThunk(
  "fetch_remove_user_photo",
  async (user: IUser, { rejectWithValue }) => {
    try {
      const res = await filesAPI.delete(user.avatar_path);
      if (!res) return;
      const updatedUser = {
        ...user,
        avatar_path: "",
      };
      return await userAPI.update(updatedUser);
    } catch (e) {
      return rejectWithValue(handlerError(e));
    }
  },
);
