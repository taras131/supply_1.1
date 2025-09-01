import {transporters} from "../utils/const";
import {IUser} from "./IUser";
import {IInvoice} from "./iInvoices";

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
    firebase_id?: string;
    transporter: string;
    lading_number: string;
    lading_file_path?: string | null;
    receiving_is_receiving?: boolean;
    receiving_date?: number;
    invoices_id: string [];
    type: string
}

export interface IShipments extends INewShipments {
    id: string;
    company_id: string;
    author_id: string;
    author?: IUser | null;
    update_author_id?: string;
    update_author?: IUser | null;
    receiving_is_receiving: boolean;
    receiving_author_id?: string;
    receiving_author?: IUser | null;
    invoices?: IInvoice;
    created_at: Date | string;
    updated_at: Date | string;
}

export const emptyShipment: INewShipments = {
    firebase_id: "",
    transporter: "-1",
    lading_number: "",
    lading_file_path: "",
    receiving_is_receiving: false,
    receiving_date: 0,
    invoices_id: [],
    type: 'air',
}

export const defaultShipment: IShipments = {
    ...emptyShipment,
    id: "0",
    company_id: "0",
    author_id: "0",
    created_at: "",
    updated_at: "",
    receiving_is_receiving: false,
}
