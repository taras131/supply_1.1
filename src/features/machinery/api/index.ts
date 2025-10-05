import { IMachinery, INewMachinery } from "../../../models/iMachinery";
import { appAPI } from "../../../api";

const machineryPath = `/machinery`;

export const machineryAPI = {
  add: async (machinery: INewMachinery) => {
    try {
      const res = await appAPI.post(machineryPath, {
        ...machinery,
        operating: Number(machinery.operating),
        odometer: Number(machinery.odometer),
      });
      return res.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        `Ошибка сервера: ${error.response?.status} ${error.response?.statusText}`;
      throw new Error(message);
    }
  },
  getAll: async () => {
    const res = await appAPI.get(machineryPath);
    return res.data;
  },
  getById: async (machinery_id: string) => {
    const res = await appAPI.get(`${machineryPath}/${machinery_id}`);
    return res.data;
  },
  getByFirebaseId: async (firebase_id: string) => {
    console.log(firebase_id);
    const res = await appAPI.get(`${machineryPath}/firebase/${firebase_id}`);
    return res.data.id;
  },
  update: async (machinery: IMachinery) => {
    try {
      const res = await appAPI.put(`${machineryPath}/${machinery.id}/`, {
        ...machinery,
        operating: Number(machinery.operating),
        odometer: Number(machinery.odometer),
      });
      return res.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        `Ошибка сервера: ${error.response?.status} ${error.response?.statusText}`;
      throw new Error(message);
    }
  },
};
