import {INewShipments, IShipments} from "../../../models/iShipments";
import {appAPI, nestServerPath} from "../../../api";

const shipmentsPath = `${nestServerPath}/shipment`

export const shipmentsAPI = {
    add: async (shipment: INewShipments) => {
        const res = await appAPI.post(shipmentsPath, shipment)
        return await res.data;
    },
    getAll: async () => {
        const res = await appAPI.get(shipmentsPath)
        return await res.data;
    },
    update: async (shipment: IShipments) => {
        const res = await appAPI.put(shipmentsPath, {
            ...shipment,
            author_date: +shipment.author_date,
        })
        return await res.data;
    }
};