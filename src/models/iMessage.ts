import { MESSAGE_SEVERITY } from "../utils/const";

export interface IMessage {
  severity: MESSAGE_SEVERITY;
  text: string;
}
