import { AppDispatch } from "./index";
import { MESSAGE_SEVERITY } from "../utils/const";
import { setMessage, setModalMessage } from "../features/messages/model/slice";
import axios, {AxiosError} from "axios";

export const handlerError = (err: unknown): string => {
  // Axios
  if (axios.isAxiosError(err)) {
    const e = err as AxiosError<any>;
    // нет ответа -> сеть/сервер недоступен
    if (!e.response) return "Сервер недоступен. Проверьте соединение и попробуйте снова.";
    const { status, statusText, data } = e.response;
    // data может быть строкой, объектом, массивом строк (class-validator)
    if (typeof data === "string") return data;
    const msg = data?.message ?? data?.error ?? data?.detail;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string" && msg.trim()) return msg;
    return `Ошибка ${status}${statusText ? `: ${statusText}` : ""}`;
  }
  // Обычный Error
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Неизвестная ошибка";
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
