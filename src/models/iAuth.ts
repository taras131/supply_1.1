export interface ILoginData {
  email: string;
  password: string;
}

export interface IRegisterData extends ILoginData {
  telegram: string;
  phone: string;
  first_name: string;
  middle_name: string;
  role_id: number;
  status_id: number;
  password: string;
  company_name: string;
  company_id: string;
  tab: string;
}

export const loginValues = {
  email: "",
  password: "",
};

export const registerValues = {
  ...loginValues,
  telegram: "",
  phone: "",
  first_name: "",
  middle_name: "",
  role_id: 0,
  status_id: 1,
  company_name: "",
  company_id: "",
  tab: "oldCompany",
};
