import {appAPI, nestServerPath} from "../../../api";
import {INewOrder, IOrder} from "../../../models/iOrders";

const ordersPath = `${nestServerPath}/order`;

export const ordersAPI = {
    add: async (order: INewOrder) => {
        const payload = {
            ...order,
            positions: (order.positions ?? []).map(({id, ...pos}) => pos),
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
    update: async (order: IOrder) => {
        console.log(order)
        const res = await appAPI.put(ordersPath, {
            ...order,
            approved_date: order.approved_date ? +order.approved_date : 0,
            cancel_date: order.cancel_date ? +order.cancel_date : 0,
        });
        return res.data;
    }
    /*  updateOrder: async (order: IOrder) => {
        const res = await updateDoc(doc(db, "orders", order.id), {
          title: order.title,
          shipmentType: order.shipmentType,
          orderType: order.orderType,
          orderItems: order.orderItems,
          comment: order.comment,
          isCancelled: order.isCancelled ? order.isCancelled : false,
        });
        return res;
      },*/
    /*  updateOrderApproved: async (updateApprovedOrderData: IUpdateApprovedOrderData) => {
        const res = await updateDoc(doc(db, "orders", updateApprovedOrderData.orderId), {
          approved: {
            isApproved: updateApprovedOrderData.newApproved.is_approved,
            userId: updateApprovedOrderData.newApproved.userId,
            date: updateApprovedOrderData.newApproved.date,
          },
        });
        return res;
      },*/
};
