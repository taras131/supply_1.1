import { TShipmentsType } from "../models/iShipments";
import { TOrdersType } from "../models/iOrders";

export enum MESSAGE_SEVERITY {
  error = "error",
  warning = "warning",
  info = "info",
  success = "success",
}

export const commentPanelId = "commentPanel";
export const shipmentPanelId = "shipment";
export const STRING_EMPTY = "";
export const STRING_WITH_SPACE = " ";
export const ADD_BUTTON_TEXT = "Добавить";
export const ALL = "all" as const;

export const drawerWidth = 240;

interface IShipmentType {
  name: TShipmentsType;
  value: string;
}

interface IOrderType {
  name: TOrdersType;
  value: string;
}

export const shipmentTypes: IShipmentType[] = [
  { name: "air", value: "Авиа" },
  { name: "railway", value: "ЖД" },
];
export const transporters = [
  "Адамант",
  "Байкал",
  "Деловые Линии",
  "Почта",
  "ПЭК",
  "СДЭК",
  "Энергия",
  "Дмитрий Павлович",
  "Евгений Владимирович",
] as const;
export const ordersTypes: IOrderType[] = [
  { name: "current", value: "Текущая" },
  { name: "annual", value: "Годовая" },
];

export const CANCEL_TEXT = "Отменён";
export const DOWNLOAD_TEXT = "Скачать";
export const UPLOAD_TEXT = "Загрузить";
export const NO_TEXT = "Нет";
export const YES_TEXT = "Да";
export const COPY_TEXT = "скопировать";
export const INN_COPY_TEXT = "ИНН скопирован";
export const VIN_COPY_TEXT = "VIN скопирован";
export const AMOUNT_COPY_TEXT = "Сумма скопирована";
export const FILE_TYPE = "file";

export enum MachineryStatus {
  active = "Работает",
  repair = "В ремонте",
  disActive = "Списана",
}

export const yearsManufacture = [
  "1990",
  "1991",
  "1992",
  "1993",
  "1994",
  "1995",
  "1996",
  "1997",
  "1998",
  "1999",
  "2000",
  "2001",
  "2002",
  "2003",
  "2004",
  "2005",
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
];
