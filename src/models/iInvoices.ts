import { TShipmentInvoiceValue } from "./iShipments";

export interface IPaid {
  isPaid: boolean;
  userId: string;
  date: number;
  paymentOrderFileLink: string;
}

export interface IApproved {
  isApproved: boolean;
  userId: string;
  date: number;
}

export interface ICancel {
  isCancel: boolean;
  date: number;
  userId: string;
}

export interface INewInvoice {
  author: {
    userId: string;
    date: number;
  };
  approved: IApproved;
  paid: IPaid;
  number: string;
  amount: number;
  isWithVAT: boolean;
  requestId: string;
  shipmentId: string;
  supplierId: string;
  invoiceFileLink: string;
  cancel: ICancel;
}

export interface IInvoice extends INewInvoice {
  id: string;
  value?: TShipmentInvoiceValue;
}

export const emptyInvoice: INewInvoice = {
  author: {
    userId: "",
    date: 0,
  },
  approved: {
    isApproved: false,
    userId: "",
    date: 0,
  },
  paid: {
    isPaid: false,
    userId: "",
    date: 0,
    paymentOrderFileLink: "",
  },
  number: "",
  amount: 0,
  isWithVAT: true,
  requestId: "",
  shipmentId: "",
  supplierId: "",
  invoiceFileLink: "",
  cancel: {
    isCancel: false,
    userId: "",
    date: 0,
  },
};
