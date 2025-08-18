import { IComment, INewComment } from "./iComent";
import { IMachinery } from "./iMachinery";

export interface INewMachineryComment extends INewComment {
  machinery_id: string;
  photos?: string[];
  is_active?: boolean;
}

export interface IMachineryComment extends IComment {
  machinery_id: string;
  machinery?: IMachinery;
  is_active?: boolean;
}

export const emptyMachineryComment: INewMachineryComment = {
  text: "",
  is_active: true,
  machinery_id: "-1",
  photos: [],
};

export const defaultMachineryComment: IMachineryComment = {
  ...emptyMachineryComment,
  id: "",
  created_at: "",
  updated_at: "",
  author_id: "",
};
