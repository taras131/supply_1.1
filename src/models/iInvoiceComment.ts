import {IComment, INewComment} from "./iComent";
import {IInvoice} from "./iInvoices";

export interface INewInvoiceComment extends INewComment {
    invoice_id: string;
    is_active?: boolean;
}

export interface IInvoiceComment extends IComment {
    invoice_id: string;
    invoice?: IInvoice;
    is_active?: boolean;
}

export const emptyInvoiceComment: INewInvoiceComment = {
    text: "",
    is_active: true,
    invoice_id: "-1",
};

export const defaultInvoiceComment: IInvoiceComment = {
    ...emptyInvoiceComment,
    id: "",
    created_at: "",
    updated_at: "",
    author_id: "",
};