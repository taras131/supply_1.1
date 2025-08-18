export interface INewMachineryDoc {
  title: string;
  machinery_id: string;
  file_name: string;
}

export interface IMachineryDoc extends INewMachineryDoc {
  id: string;
  created_date: number;
  updated_date: number;
}

export const emptyMachineryDoc: INewMachineryDoc = {
  title: "",
  machinery_id: "",
  file_name: "",
};
