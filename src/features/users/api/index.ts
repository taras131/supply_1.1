import { appAPI } from "../../../api";
import { IUser } from "../../../models/IUser";

const usersPath = `/users`;

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
  getByFirebaseId: async (firebase_id: string) => {
    const res = await appAPI.get(`${usersPath}/firebase/${firebase_id}`);
    return res.data.id;
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
