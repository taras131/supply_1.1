import {INewShipments} from "../../../models/iShipments";
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

};