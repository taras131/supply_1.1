import {appAPI} from "../../../api";
import {IInvoice, INewInvoice} from "../../../models/iInvoices";
import {TInvoiceFilter} from "../model/actions";

const invoicePath =`/invoice`

export const invoicesAPI = {
  add: async (invoice: INewInvoice) => {
    console.log(invoice)
    const res = await appAPI.post(invoicePath, invoice);
    return res.data;
  },
  getAll: async (filter: TInvoiceFilter) => {
    const params = !filter || filter === "all" ? {} : { filter };
    const res = await appAPI.get(invoicePath, {params});
    return res.data;
  },
  getForNewShipment: async () => {
    const res = await appAPI.get(`${invoicePath}/for_new_shipment`);
    return res.data;
  },
  getById: async (id: string) => {
    const res = await appAPI.get(`${invoicePath}/get_by_id/${id}`);
    return res.data;
  },
  update: async (invoice: IInvoice) => {
    console.log(invoice)
    const res = await appAPI.put(invoicePath, invoice);
    return res.data;
  },
  getByFirebaseId: async (firebase_id: string) => {
    const res = await appAPI.get(`${invoicePath}/firebase/${firebase_id}`);
    return res.data.id;
  },
  getStatistics: async () => {
    const res = await appAPI.get(`${invoicePath}/statistics`);
    return res.data;
  },
}
