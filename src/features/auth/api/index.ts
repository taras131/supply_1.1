import {ILoginData, IRegisterData} from "../../../models/iAuth";
import {appAPI, nestServerPath} from "../../../api";
import {IChangePassword} from "../model/actions";

const registerPath = `/auth/register`;
const loginPath = `auth/login`;
const mePath = `/auth/me`;
const logoutPath = `/auth/logout`;
const changePasswordPath = `/auth/change_password`;

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
            console.log(registerPath)
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
    changePassword: async (changeData: IChangePassword) => {
        const res = await appAPI.post(changePasswordPath, changeData);
        return res.data;
    },
};
