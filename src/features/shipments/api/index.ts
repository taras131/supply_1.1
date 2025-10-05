import {INewShipments, IShipments} from "../../../models/iShipments";
import {appAPI} from "../../../api";

const shipmentsPath = `/shipment`

export const shipmentsAPI = {
    add: async (shipment: INewShipments) => {
        console.log(shipment);
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
            receiving_date: shipment.receiving_date ? + shipment.receiving_date : 0,
        })
        return await res.data;
    },
    updateShipmentInvoices: async (shipment: IShipments) => {
        const res = await appAPI.put(`${shipmentsPath}/invoices`, {
            ...shipment,
            author_date: +shipment.author_date,
            receiving_date: shipment.receiving_date ? + shipment.receiving_date : 0,
        })
        return await res.data;
    },
};