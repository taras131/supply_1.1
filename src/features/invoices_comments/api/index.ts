import {appAPI} from "../../../api";
import {IInvoiceComment, INewInvoiceComment} from "../../../models/iInvoiceComment";

const invoiceCommentsPath = `/invoice-comment`;

export const invoiceCommentAPI = {
    add: async (comment: INewInvoiceComment) => {
        try {
            const res = await appAPI.post(invoiceCommentsPath, comment);
            return res.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.detail ||
                `Ошибка сервера: ${error.response?.status} ${error.response?.statusText}`;
            throw new Error(message);
        }
    },
    getAll: async () => {
        const res = await appAPI.get(invoiceCommentsPath);
        return res.data;
    },
    update: async (comment: IInvoiceComment) => {
        try {
            const res = await appAPI.put(`${invoiceCommentsPath}/${comment.id}/`, comment);
            return res.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.detail ||
                `Ошибка сервера: ${error.response?.status} ${error.response?.statusText}`;
            throw new Error(message);
        }
    },
    delete: async (comment_id: string) => {
        const res = await appAPI.delete(`${invoiceCommentsPath}/${comment_id}`);
        return res.data;
    },
};