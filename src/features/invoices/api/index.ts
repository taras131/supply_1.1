import {appAPI, nestServerPath} from "../../../api";
import {IInvoice, INewInvoice} from "../../../models/iInvoices";
import {TInvoiceFilter} from "../model/actions";

const invoicePath =`${nestServerPath}/invoice`

export const invoicesAPI = {
  add: async (invoice: INewInvoice) => {
    const res = await appAPI.post(invoicePath, invoice);
    return res.data;
  },
  getAll: async (filter: TInvoiceFilter) => {
    const params = !filter || filter === "all" ? {} : { filter };
    const res = await appAPI.get(invoicePath, {params});
    return res.data;
  },
  getById: async (id: string) => {
    const res = await appAPI.get(`${invoicePath}/${id}`);
    return res.data;
  },
  update: async (invoice: IInvoice) => {
    console.log(invoice)
    const res = await appAPI.put(invoicePath, invoice);
    return res.data;
  },
}
