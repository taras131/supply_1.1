import {appAPI, nestServerPath} from "../../../api";
import {INewOrderPosition, IOrderPosition} from "../../../models/IOrdersPositions";

const ordersPositionsPath = `${nestServerPath}/order-position`;

export const ordersPositionsAPI = {
    create: async (ordersPosition: INewOrderPosition) => {
        const {id, ...position_in} = ordersPosition
        const res = await appAPI.post(ordersPositionsPath, position_in);
        return await res.data;
    },
    getAll: async () => {
        const res = await appAPI.get(ordersPositionsPath);
        return await res.data;
    },
    update: async (ordersPosition: INewOrderPosition | IOrderPosition) => {
        console.log(ordersPosition)
        const res = await appAPI.put(ordersPositionsPath, ordersPosition);
        console.log(res.data)
        return await res.data;
    },
    delete: async (positionId: string) => {
        console.log(positionId)
        const res = await appAPI.delete(`${ordersPositionsPath}/${positionId}`);
        console.log(res)
        return await res.data;
    },
};
