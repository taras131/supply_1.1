import {appAPI} from "../../../api";
import {INewTechnicalLiterature, ITechnicalLiterature} from "../../../models/ITechnicalLiterature";

const technicalLiteraturePath = `/technical_literature`;

export const technicalLiteratureAPI = {
    add: async (literature: INewTechnicalLiterature) => {
        try {
            const res = await appAPI.post(
                technicalLiteraturePath,
                {
                    ...literature,
                    year_from: +literature.year_from || 0,
                    year_to: +literature.year_to || 0,
                    engine_type_ids: literature.engine_type_ids.map(item => Number(item)),
                    file_size: +literature.file_size || 0,
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
    update: async (literature: ITechnicalLiterature) => {
        console.log(literature)
        try {
            const res = await appAPI.put(`${technicalLiteraturePath}/${literature.id}/`, {
                ...literature,
                year_from: +literature.year_from || 0,
                year_to: +literature.year_to || 0,
                file_size: +literature.file_size || 0,
                engine_type_ids: literature.engine_type_ids.map(item => Number(item)),
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
    delete: async (comment_id: string) => {
        const res = await appAPI.delete(`${technicalLiteraturePath}/${comment_id}`);
        return res.data;
    },
};