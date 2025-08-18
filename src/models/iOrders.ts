import { IUser } from "./IUser";
import { IMachinery } from "./iMachinery";
import { defaultOrderPosition, emptyOrderPosition, INewOrderPosition, IOrderPosition } from "./IOrdersPositions";
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

export interface INewOrder {
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
}

export interface IOrder extends INewOrder {
  id: string;
  approved_author?: IUser | null;
  cancel_author?: IUser | null;
  author_id: string;
  author?: IUser;
  machinery?: IMachinery | null;
  created_at: Date | string;
  updated_at: Date | string;
  positions: IOrderPosition[];
}

export const emptyOrder: INewOrder = {
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
  machinery_id: null,
  positions: [emptyOrderPosition],
};

export const defaultOrder: IOrder = {
  id: "",
  firebase_id: "",
  title: "",
  category: "-1",
  shipments_type: shipmentTypes[0].name,
  type:  ordersTypes[0].name,
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
  positions: [defaultOrderPosition],
  created_at: new Date(),
  updated_at: new Date(),
};
