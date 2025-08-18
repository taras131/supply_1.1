import { appAPI, nestServerPath } from "../../../api";

const ordersPositionsPath = `${nestServerPath}/orders-positions`;

export const ordersPositionsAPI = {
  getAll: async () => {
    const res = await appAPI.get(ordersPositionsPath);
    return await res.data;
  },
  delete: async (prositionId: string) => {
    const res = await appAPI.delete(`${ordersPositionsPath}/${prositionId}`);
    return await res.data;
  },
};
