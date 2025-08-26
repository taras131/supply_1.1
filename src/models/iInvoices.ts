import {IUser} from "./IUser";
import {ISupplier} from "./iSuppliers";

export interface INewInvoice {
  firebase_id?: string;
  number: string;
  amount: number;
  is_with_vat: boolean;
  invoice_file_link: string;
  supplier_id: string;
  supplier?: ISupplier;

  author_date: number;
  author_id: string | null;
  author?: IUser | null;

  approved_is_approved?: boolean;
  approved_date?: number;
  approved_user_id?: string | null;

  cancel_is_cancel: boolean;
  cancel_date?: number;
  cancel_user_id?: string | null;
  cancel_user?: IUser | null;

  paid_is_paid: boolean;
  paid_date?: number;
  paid_user_id?: string | null;
  paid_user?: IUser;
  paid_payment_order_file_link: string;
}

export interface IInvoice extends INewInvoice {
  id: string
  updated_at?: number;
  updated_author_id?: string | null;
  updated_author?: IUser | null;
}

export const emptyInvoice: INewInvoice = {
  firebase_id: "",
  number: "",
  amount: 0,
  is_with_vat: true,
  supplier_id: "-1",
  invoice_file_link: "",

  author_date: 0,
  author_id: null,

  approved_is_approved: false,
  approved_date: 0,
  approved_user_id: null,

  cancel_is_cancel: false,
  cancel_date: 0,
  cancel_user_id: null,

  paid_is_paid: false,
  paid_date: 0,
  paid_user_id: null,
  paid_payment_order_file_link: "",

};

export const defaultInvoice: IInvoice =  {
  ...emptyInvoice,
  id: "0",
}
