import {transporters} from "../utils/const";

export type TShipmentInvoiceValue = "completely" | "partly";

export interface IShipmentsInvoice {
  invoiceId: string;
  volume: TShipmentInvoiceValue;
}

export type TShipmentsType = "railway" | "air";

export interface IReceiving {
  userId: string;
  dateCreating: number;
  isReceived: boolean;
}

export type Transporter = (typeof transporters)[number];

export interface INewShipments {
  author: {
    userId: string;
    dateCreating: number;
  };
  receiving: IReceiving;
  ladingNumber: string;
  ladingNumberFilePath: string;
  transporter: Transporter;
  type: TShipmentsType;
  invoicesList: IShipmentsInvoice[];
}

export interface IShipments extends INewShipments {
  id: string;
}
