import { defaultUser, IUser } from "./IUser";
import { IMachinery } from "./iMachinery";
import { ITask } from "./IMachineryTasks";

export interface ISubCategory {
  id: number;
  name: string;
}

export interface ICategory {
  id: number;
  name: string;
  subcategories: ISubCategory[];
}

export interface INewMachineryProblem {
  title: string;
  description: string;
  photos: string[];
  priority_id: number;
  category_id: number;
  status_id: number;
  operating: number;
  odometer: number;
  machinery_id: string;
}

export interface IMachineryProblem extends INewMachineryProblem {
  id: string;
  author_id: string;
  author?: IUser;
  updated_author_id?: string;
  updated_author?: IUser;
  machinery?: IMachinery;
  result_date: number;
  created_at: string;
  updated_at: string | null;
  company_id: string;
  tasks?: ITask[];
  tasks_id?: string[];
}

export const emptyProblem: INewMachineryProblem = {
  title: "",
  description: "",
  photos: [],
  priority_id: 2,
  category_id: -1,
  operating: 0,
  odometer: 0,
  status_id: 1,
  machinery_id: "-1",
};

export const defaultProblem: IMachineryProblem = {
  ...emptyProblem,
  id: "0",
  author_id: "0",
  result_date: 0,
  created_at: "0",
  updated_at: null,
  tasks_id: [],
  company_id: "0",
  author: defaultUser,
};

export const problemStatus = [
  { id: 1, title: "Ожидает" },
  { id: 2, title: "В работе" },
  { id: 3, title: "Решена" },
];

export const problemPriority = [
  { id: 1, title: "Ждёт" },
  { id: 2, title: "Важно" },
  { id: 3, title: "Критично" },
];
