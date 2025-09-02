import {IUser} from "./IUser";
import {IMachinery} from "./iMachinery";
import {emptyOrderPosition, INewOrderPosition, IOrderPosition} from "./IOrdersPositions";
import {TShipmentsType} from "./iShipments";

export enum CompletionType {
    Invoice = "INVOICE",
    Cash = "CASH", // Куплена за наличные
    Balance = "BALANCE", // Забрана за счёт остатка средств
}

export type TOrdersType = "current" | "annual";

export interface IOrderType {
    name: TOrdersType;
    value: string;
}

export const ordersTypes: IOrderType[] = [
    {name: "current", value: "Текущая"},
    {name: "annual", value: "Годовая"},
];

interface IShipmentType {
    name: TShipmentsType;
    value: string;
}

export const shipmentTypes: IShipmentType[] = [
    {name: "air", value: "Авиа"},
    {name: "railway", value: "ЖД"},
];

export const orderCategories = [
    "Смешанная",
    "Автозапчасти",
    "Автоэлектрика",
    "Металлорез",
    "Сварочный цех",
    "Инструмент",
    "Энергетика",
    "АХО"
];

export interface INewOrder {
    author_id?: string;
    firebase_id?: string;
    title: string;
    category?: string;
    shipments_type: string;
    type: string;
    is_approved?: boolean;
    approved_date?: number;
    approved_author_id?: string | null;
    is_cancel?: boolean;
    cancel_date?: number;
    cancel_author_id?: string | null;
    machinery_id?: string | null;
    positions: INewOrderPosition[];
    author_date: number;
}

export interface IOrder extends Omit<INewOrder, 'positions'> {
    id: string;
    approved_author?: IUser | null;
    cancel_author?: IUser | null;
    author_id: string;
    author?: IUser;
    updated_author_id?: string | null;
    updated_author?: IUser | null;
    machinery?: IMachinery | null;
    created_at: Date | string;
    updated_at: Date | string;
    completion_percent?: number;
    positions_done?: number;
    positions_total?: number;
    items_total?: number;
    positions?: IOrderPosition [];
}

export const emptyOrder: INewOrder = {
    firebase_id: "",
    title: "",
    category: "Смешанная",
    shipments_type: shipmentTypes[0].name,
    type: ordersTypes[0].name,
    is_approved: false,
    approved_date: 0,
    approved_author_id: null,
    is_cancel: false,
    cancel_date: 0,
    cancel_author_id: null,
    machinery_id: "-1",
    positions: [emptyOrderPosition],
    author_date: 0,
};

export const defaultOrder: IOrder = {
    id: "",
    firebase_id: "",
    title: "",
    category: "-1",
    shipments_type: shipmentTypes[0].name,
    type: ordersTypes[0].name,
    is_approved: false,
    approved_date: 0,
    approved_author_id: null,
    is_cancel: false,
    cancel_date: 0,
    cancel_author_id: null,
    author_id: "",
    machinery_id: null,
    machinery: null,
    approved_author: null,
    cancel_author: null,
    created_at: new Date(),
    updated_at: new Date(),
    author_date: 0,
};
