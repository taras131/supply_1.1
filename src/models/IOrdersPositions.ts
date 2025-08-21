import {IUser} from "./IUser";
import {CompletionType} from "./iOrders";

export interface ISelectedOrderPosition {
    [key: string]: number[];
}

export interface INewOrderPosition {
    id: number;
    name: string;
    catalog_number: string;
    count: number;
    comment: string;
    is_ordered: boolean;
    completion_type: CompletionType | null;
    photos: string[];
    link: string;
    invoice_id: string | null;
    assigned_to_id: string | null;
    order_id?: string;
    unit_measure: string;
}

export interface IOrderPosition extends INewOrderPosition {
    assigned_to?: IUser;
    order_id: string;
}

export const unitMeasures = ["шт", "комп", "метр", "кг"]

export const emptyOrderPosition: INewOrderPosition = {
    id: 0,
    name: "",
    catalog_number: "",
    count: 1,
    comment: "",
    is_ordered: false,
    completion_type: null,
    photos: [],
    link: "",
    invoice_id: null,
    assigned_to_id: null,
    unit_measure: unitMeasures[0],
};

export const defaultOrderPosition: IOrderPosition = {
    ...emptyOrderPosition,
    id: 0,
    order_id: "",
};

