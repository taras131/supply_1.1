import { ILoginData, IRegisterData } from "../../../models/iAuth";
import { appAPI, nestServerPath } from "../../../api";

const registerPath = `${nestServerPath}/auth/register`;
const loginPath = `${nestServerPath}/auth/login`;
const mePath = `${nestServerPath}/auth/me`;
const logoutPath = `${nestServerPath}/auth/logout`;

export const authAPI = {
  login: async (authData: ILoginData) => {
    try {
      const res = await appAPI.post(loginPath, authData);
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Ошибка сервера: ${error.response?.status} ${error.response?.statusText}`,
      );
    }
  },
  register: async (registerData: IRegisterData) => {
    try {
      const res = await appAPI.post(registerPath, registerData);
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Ошибка сервера: ${error.response?.status} ${error.response?.statusText}`,
      );
    }
  },
  me: async () => {
    try {
      const res = await appAPI.get(mePath);
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Ошибка сервера: ${error.response?.status} ${error.response?.statusText}`,
      );
    }
  },
  out: async () => {
    return await appAPI.post(logoutPath);
  },
};
