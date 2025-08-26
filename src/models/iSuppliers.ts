import {emptyCompany, INewCompany} from "./iCompanies";

export interface INewSupplier extends INewCompany {
  id?: string;
  phone: string;
  manager_email: string;
  accounts_department_email: string;
}

export interface ISupplier extends INewSupplier {
  id: string;
  created_at: string;
  updated_at: string;
  company_id: string;
}

export const emptySupplier: INewSupplier = {
  ...emptyCompany,
  phone: '',
  manager_email: '',
  accounts_department_email: '',
};

export const defaultSupplier: ISupplier = {
  ...emptySupplier,
  id: '',
  created_at: '',
  updated_at: '',
  company_id: '',
};
