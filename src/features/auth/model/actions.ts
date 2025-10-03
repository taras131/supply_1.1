import { createAsyncThunk } from "@reduxjs/toolkit";
import { handlerError } from "../../../store/handleError";
import { ILoginData, IRegisterData } from "../../../models/iAuth";
import { authAPI } from "../api";
import { MESSAGE_SEVERITY } from "../../../utils/const";
import { setMessage } from "../../messages/model/slice";
import { thunkHandlers } from "../../../store/thunkHandlers";
import { setCurrentUser } from "../../users/model/slice";
import { setCurrentCompany } from "../../companies/model/slice";

const handleAuth = async (
  apiMethod: (data: any) => Promise<{ access_token: string }>,
  data: any,
  successMsg: string,
  dispatch: any,
) => {
  const { access_token } = await apiMethod(data);
  if (access_token) {
    localStorage.setItem("access_token", access_token);
    dispatch(
      setMessage({
        severity: MESSAGE_SEVERITY.success,
        text: successMsg,
      }),
    );
    dispatch(fetchCheckAuth());
  }
  return await authAPI.me();
};

export const fetchLogin = createAsyncThunk(
  "fetch_login",
  async (authData: ILoginData, { dispatch, rejectWithValue }) => {
    try {
      return await handleAuth(authAPI.login, authData, "Вы успешно вошли в систему.", dispatch);
    } catch (e) {
      return rejectWithValue(thunkHandlers.error(e, dispatch));
    }
  },
);

export const fetchRegister = createAsyncThunk(
  "fetch_register",
  async (registerData: IRegisterData, { dispatch, rejectWithValue }) => {
    try {
      return await handleAuth(authAPI.register, registerData, "Вы успешно зарегистрированы!", dispatch);
    } catch (e) {
      return rejectWithValue(thunkHandlers.error(e, dispatch));
    }
  },
);

export const fetchOut = createAsyncThunk("fetch_out", async (_, {dispatch,rejectWithValue }) => {
  try {
    localStorage.removeItem("access_token");
    await authAPI.out();
    dispatch(setCurrentUser(null))
    dispatch(setCurrentCompany(null))
    return true;
  } catch (e) {
    return rejectWithValue(handlerError(e));
  }
});

export const fetchCheckAuth = createAsyncThunk("fetch_check_auth", async (_, { dispatch, rejectWithValue }) => {
  try {
    const currentUser = await authAPI.me();
    dispatch(setCurrentUser(currentUser));
    dispatch(setCurrentCompany(currentUser.company));
    return currentUser;
  } catch (e) {
    return true;
  }
});

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}

export const fetchChangePassword = createAsyncThunk(
    "auth/change_password",
    async (changeData: IChangePassword, { dispatch, rejectWithValue }) => {
        try {
            return await authAPI.changePassword(changeData);
        } catch (e) {
            return rejectWithValue(thunkHandlers.error(e, dispatch));
        }
    },
);
