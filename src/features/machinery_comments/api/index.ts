import { appAPI } from "../../../api";
import { IMachineryComment, INewMachineryComment } from "../../../models/IMachineryComment";

const machineryCommentsPath = `/machinery-comment`;

export const machineryCommentAPI = {
  add: async (comment: INewMachineryComment) => {
    try {
      console.log(comment.machinery_id);
      const res = await appAPI.post(machineryCommentsPath, comment);
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
    const res = await appAPI.get(machineryCommentsPath);
    return res.data;
  },
  update: async (comment: IMachineryComment) => {
    try {
      const res = await appAPI.put(`${machineryCommentsPath}/${comment.id}/`, comment);
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
    const res = await appAPI.delete(`${machineryCommentsPath}/${comment_id}`);
    return res.data;
  },
};
