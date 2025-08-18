import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { appAPI, nestServerPath } from "../../../api";
import {INewOrder, IOrder} from "../../../models/iOrders";

const ordersPath = `${nestServerPath}/orders`;

export const ordersAPI = {
  addOrder: async (order: INewOrder) => {
    const res = await addDoc(collection(db, "orders"), order);
    return res;
  },
  getAll: async () => {
    const res = await appAPI.get(ordersPath);
    return await res.data;
  },
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
