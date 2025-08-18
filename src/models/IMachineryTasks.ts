import { defaultUser, IUser } from "./IUser";
import { IMachineryProblem } from "./IMachineryProblems";
import { IMachinery } from "./iMachinery";

export interface ITaskStatus {
  id: number;
  title: string;
}

export interface ITaskPriority {
  id: number;
  title: string;
}

export interface INewTask {
  title: string;
  description: string;
  status_id: number;
  priority_id: number;
  due_date: number;
  event_location: string;
  assigned_to_id?: string;
  machinery_id: string;
  issue_photos: string[];
  problem_id?: string;
  type_id: number;
  issue_operating: number;
  issue_odometer: number;
}

export interface ITask extends INewTask {
  id: string;
  author_id: string;
  author: IUser;
  updated_author_id?: string | null;
  updated_author?: IUser | null;
  assigned_to?: IUser;
  problem?: IMachineryProblem;
  result_date: number;
  result_photos: string[];
  result_description: string;
  result_operating: number;
  result_odometer: number;
  result_spent_resources: string;
  created_at: string;
  updated_at?: string;
  machinery?: IMachinery;
}

export const taskPriority: ITaskPriority[] = [
  { id: 1, title: "Не срочно и не важно" },
  { id: 2, title: "Срочно, но не важно" },
  { id: 3, title: "Не срочно, но важно" },
  { id: 4, title: "Срочно и важно" },
];

export const taskStatus: ITaskStatus[] = [
  { id: 1, title: "Новая" },
  { id: 2, title: "В работе" },
  { id: 3, title: "Завершена" },
];

export const getTaskStatusById = (id: number): string => {
  return taskStatus.filter((status) => status.id === id)[0].title;
};

export const taskTypes: ITaskStatus[] = [
  { id: 1, title: "Тех обслуживание" },
  { id: 2, title: "Ремонт" },
];

export const getTaskTypeById = (id: number): string => {
  return taskTypes.filter((type) => type.id === id)[0].title;
};

export const emptyTask: INewTask = {
  title: "",
  description: "",
  status_id: 1,
  priority_id: -1,
  due_date: 0,
  event_location: "",
  assigned_to_id: "-1",
  machinery_id: "-1",
  issue_photos: [],
  problem_id: "-1",
  type_id: -1,
  issue_operating: 0,
  issue_odometer: 0,
};

export const defaultTask: ITask = {
  ...emptyTask,
  author_id: "-1",
  author: defaultUser,
  id: "0",
  result_date: 0,
  result_photos: [],
  result_description: "",
  result_operating: 0,
  result_odometer: 0,
  result_spent_resources: "",
  created_at: "",
};
