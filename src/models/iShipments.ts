import {transporters} from "../utils/const";
import {IUser} from "./IUser";
import {IInvoice} from "./iInvoices";

export type TShipmentInvoiceValue = "completely" | "partly";

export interface IShipmentsInvoice {
    invoice_id: string;
    volume: TShipmentInvoiceValue;
    invoice?: IInvoice;
}

export type TShipmentsType = "railway" | "air" | "-1";

export interface IReceiving {
    userId: string;
    dateCreating: number;
    isReceived: boolean;
}

export type Transporter = (typeof transporters)[number];

export interface INewShipments {
    firebase_id?: string;
    author_id?: string | null;
    transporter: string;
    lading_number: string;
    lading_file_path?: string | null;
    photo_file_path?: string | null;
    photo_file_paths?: string[];
    receiving_is_receiving?: boolean;
    receiving_date?: number | null;
    receiving_author_id?: string | null;
    shipment_invoices: IShipmentsInvoice [];
    type: TShipmentsType;
    author_date: number;
}

export interface IShipments extends INewShipments {
    id: string;
    company_id: string;
    author_id: string;
    author?: IUser | null;
    update_author_id?: string;
    update_author?: IUser | null;
    receiving_is_receiving: boolean;
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
    photo_file_path: null,
    receiving_is_receiving: false,
    receiving_date: 0,
    shipment_invoices: [],
    type: 'air',
    author_date: 0,
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
