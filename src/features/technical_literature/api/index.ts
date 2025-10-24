import {IMachineryComment} from "../../../models/IMachineryComment";
import {appAPI} from "../../../api";
import {INewTechnicalLiterature} from "../../../models/ITechnicalLiterature";

const technicalLiteraturePath = `/technical_literature`;

export const technicalLiteratureAPI = {
    add: async (literature: INewTechnicalLiterature) => {
        try {
            const res = await appAPI.post(
                technicalLiteraturePath,
                {
                    ...literature,
                    year_from: +literature.year_from,
                    year_to: +literature.year_to,
                    pages: Number(literature?.pages || 0),
                });
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
        const res = await appAPI.get(technicalLiteraturePath);
        return res.data;
    },
    update: async (book: IMachineryComment) => {
        try {
            const res = await appAPI.put(`${technicalLiteraturePath}/${book.id}/`, book);
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
        const res = await appAPI.delete(`${technicalLiteraturePath}/${comment_id}`);
        return res.data;
    },
};