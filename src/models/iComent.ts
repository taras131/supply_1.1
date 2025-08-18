import { IUser } from "./IUser";

export interface INewComment {
  text: string;
}

export interface IComment extends INewComment {
  id: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  author?: IUser;
}
