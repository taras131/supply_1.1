import { appAPI, nestServerPath } from "../../../api";
import { IUser } from "../../../models/IUser";

const usersPath = `${nestServerPath}/users`;

export const userAPI = {
  getAll: async () => {
    try {
      const res = await appAPI.get(usersPath);
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Ошибка сервера: ${error.response?.status} ${error.response?.statusText}`,
      );
    }
  },
  update: async (updateData: IUser) => {
    try {
      const res = await appAPI.put(usersPath, updateData);
      return res.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || `Ошибка сервера: ${error.response?.status} ${error.response?.statusText}`,
      );
    }
  },
};
