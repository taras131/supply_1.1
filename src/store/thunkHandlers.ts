import { AppDispatch } from "./index";
import { MESSAGE_SEVERITY } from "../utils/const";
import { setMessage, setModalMessage } from "../features/messages/model/slice";

export const handlerError = (e: unknown): string => {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  if (typeof e === "object" && e !== null && "message" in e && typeof (e as any).message === "string") {
    return (e as any).message;
  }
  return "неизвестная ошибка";
};

export const thunkHandlers = {
  error: (e: unknown, dispatch: any) => {
    const errorMessage = handlerError(e);
    dispatch(setModalMessage(errorMessage));
    return errorMessage;
  },
  success: (message: string, dispatch: AppDispatch) => {
    dispatch(
      setMessage({
        severity: MESSAGE_SEVERITY.success,
        text: message,
      }),
    );
  },
};
