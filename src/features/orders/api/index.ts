import {appAPI} from "../../../api";
import {INewOrder, IOrder} from "../../../models/iOrders";

const ordersPath = `/order`;

export const ordersAPI = {
    add: async (order: INewOrder) => {
        const payload = {
            ...order,
            positions: (order.positions ?? []).map(({id, ...pos}) => pos),
            machinery_id: order.machinery_id === "-1" ? null : order.machinery_id,
        };
        const res = await appAPI.post(ordersPath, payload);
        return res.data;
    },
    getAll: async () => {
        const res = await appAPI.get(ordersPath);
        return await res.data;
    },
    getById: async (orderId: string) => {
        const res = await appAPI.get(`${ordersPath}/${orderId}`);
        return await res.data;
    },
    getForNewInvoice: async () => {
        const res = await appAPI.get(`${ordersPath}/for_new_invoice`);
        return await res.data;
    },
    getForInvoice: async (invoiceId: string) => {
        const res = await appAPI.get(`${ordersPath}/for_invoice/${invoiceId}`);
        console.log(res)
        return await res.data;
    },
    update: async (order: IOrder) => {
        const res = await appAPI.put(ordersPath, {
            ...order,
            author_date: order.author_date ? +order.author_date : 0,
            approved_date: order.approved_date ? +order.approved_date : 0,
            cancel_date: order.cancel_date ? +order.cancel_date : 0,
            machinery_id: order.machinery_id === "-1" ? null : order.machinery_id,
        });
        return res.data;
    }
};
