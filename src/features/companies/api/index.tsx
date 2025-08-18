import { appAPI, nestServerPath } from "../../../api";
import { ICompany } from "../../../models/iCompanies";

export const companyPath = `${nestServerPath}/companies`;

export const companyAPI = {
  checkById: async (company_id: string) => {
    const res = await appAPI.get(`${companyPath}/${company_id}`, {});
    return res.data;
  },
  update: async (company: ICompany) => {
    const res = await appAPI.put(companyPath, company);
    return res.data;
  },
};
