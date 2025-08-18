import { appAPI, nestServerPath } from "../../../api";
import { INewMachineryDoc } from "../../../models/IMachineryDoc";

export const machineryDocsPath = `${nestServerPath}/machinery-docs`;

export const machineryDocsAPI = {
  add: async (machineryDoc: INewMachineryDoc) => {
    const res = await appAPI.post(machineryDocsPath, machineryDoc);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await appAPI.delete(`${machineryDocsPath}/${id}`);
    return res.data;
  },
};
