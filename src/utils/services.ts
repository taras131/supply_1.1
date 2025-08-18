import { TShipmentsType } from "../models/iShipments";
import { INewTask, ITask } from "../models/IMachineryTasks";
import {IOrderPosition} from "../models/IOrdersPositions";

const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

const formatDate = (date: Date) => {
  return [padTo2Digits(date.getDate()), padTo2Digits(date.getMonth() + 1), date.getFullYear()].join(".");
};

export const getDateInMilliseconds = () => {
  return Date.now();
};

export const convertMillisecondsToDate = (milliseconds: number) => {
  return formatDate(new Date(milliseconds));
};

const MONTHS_RU_SHORT = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
export const convertMillisecondsToDateWithTextMonths = (milliseconds: number) => {
  const date = new Date(milliseconds);
  const day = date.getDate();
  const month = MONTHS_RU_SHORT[date.getMonth()];
  return `${day} ${month}`;
};

export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const checkExists = (newValue: string, existingValuesArr: string[]): boolean => {
  let isExist = false;
  existingValuesArr.forEach((value) => {
    if (value.toUpperCase() === newValue.toUpperCase()) {
      isExist = true;
      return;
    }
  });
  return isExist;
};

export const validateText = (
  newValue: string,
  setError: (newValue: string) => void,
  existingValuesArr: string[],
  newValueMinLength: number,
) => {
  setError("");
  const newValueNumberLetters = newValue.match(/[a-zA-Zа-яА-Я]/g);
  if (!newValueNumberLetters) {
    setError("Поле должно содержать буквы");
  } else {
    if (newValueNumberLetters.length < newValueMinLength) {
      setError(`Поле должно содержать не меньше ${newValueMinLength} букв`);
    } else {
      if (checkExists(newValue, existingValuesArr)) {
        setError("Такое значение уже существует");
      }
    }
  }
};
export const transliterate = (text: string) => {
  text = text
    .replace(/\u0401/g, "YO")
    .replace(/\u0419/g, "I")
    .replace(/\u0426/g, "TS")
    .replace(/\u0423/g, "U")
    .replace(/\u041A/g, "K")
    .replace(/\u0415/g, "E")
    .replace(/\u041D/g, "N")
    .replace(/\u0413/g, "G")
    .replace(/\u0428/g, "SH")
    .replace(/\u0429/g, "SCH")
    .replace(/\u0417/g, "Z")
    .replace(/\u0425/g, "H")
    .replace(/\u042A/g, "")
    .replace(/\u0451/g, "yo")
    .replace(/\u0439/g, "i")
    .replace(/\u0446/g, "ts")
    .replace(/\u0443/g, "u")
    .replace(/\u043A/g, "k")
    .replace(/\u0435/g, "e")
    .replace(/\u043D/g, "n")
    .replace(/\u0433/g, "g")
    .replace(/\u0448/g, "sh")
    .replace(/\u0449/g, "sch")
    .replace(/\u0437/g, "z")
    .replace(/\u0445/g, "h")
    .replace(/\u044A/g, "'")
    .replace(/\u0424/g, "F")
    .replace(/\u042B/g, "I")
    .replace(/\u0412/g, "V")
    .replace(/\u0410/g, "a")
    .replace(/\u041F/g, "P")
    .replace(/\u0420/g, "R")
    .replace(/\u041E/g, "O")
    .replace(/\u041B/g, "L")
    .replace(/\u0414/g, "D")
    .replace(/\u0416/g, "ZH")
    .replace(/\u042D/g, "E")
    .replace(/\u0444/g, "f")
    .replace(/\u044B/g, "i")
    .replace(/\u0432/g, "v")
    .replace(/\u0430/g, "a")
    .replace(/\u043F/g, "p")
    .replace(/\u0440/g, "r")
    .replace(/\u043E/g, "o")
    .replace(/\u043B/g, "l")
    .replace(/\u0434/g, "d")
    .replace(/\u0436/g, "zh")
    .replace(/\u044D/g, "e")
    .replace(/\u042F/g, "Ya")
    .replace(/\u0427/g, "CH")
    .replace(/\u0421/g, "S")
    .replace(/\u041C/g, "M")
    .replace(/\u0418/g, "I")
    .replace(/\u0422/g, "T")
    .replace(/\u042C/g, "'")
    .replace(/\u0411/g, "B")
    .replace(/\u042E/g, "YU")
    .replace(/\u044F/g, "ya")
    .replace(/\u0447/g, "ch")
    .replace(/\u0441/g, "s")
    .replace(/\u043C/g, "m")
    .replace(/\u0438/g, "i")
    .replace(/\u0442/g, "t")
    .replace(/\u044C/g, "'")
    .replace(/\u0431/g, "b")
    .replace(/\u044E/g, "yu");

  return text;
};

const millisecondsInDay = 86400000;

export const getProjectedArrivalDate = (dispatchDate: number, shipmentsType: TShipmentsType): string => {
  if (shipmentsType === "air") {
    return convertMillisecondsToDate(dispatchDate + millisecondsInDay * 4);
  } else {
    return convertMillisecondsToDate(dispatchDate + millisecondsInDay * 45);
  }
};

export const extractAllText = (str: string): string => {
  const matches = str.split('"');
  return matches[1] ? matches[1] : str;
};

export const deleteYearFromString = (str: string) => {
  const arr = str.split(".");
  return `${arr[0]}.${arr[1]}`;
};
export const getIsCompleteOrder = (orderItems: IOrderPosition[]): boolean => {
  let isComplete = true;
  orderItems.forEach((orderItem) => {
    if (!orderItem.invoice_id || orderItem.invoice_id.length < 5) {
      if (!orderItem.completion_type) isComplete = false;
    }
  });
  return isComplete;
};

export const getWordAfter = (text: string, targetWord: string) => {
  const regex = new RegExp(`\\b${targetWord}\\b\\s+(\\w+)`, "i");
  const match = text.match(regex);
  return match ? match[1] : null;
};

export const getPriorityColor = (priorityId: number)=> {
  let color = "success";
  switch (priorityId) {
    case 1:
      color = "primary";
      break;
    case 2:
      color = "secondary";
      break;
    case 3:
      color = "warning";
      break;
  }
  return color;
};

export const isTask = (task: ITask | INewTask): task is ITask => {
  return (
    "id" in task &&
    "created_date" in task &&
    "updated_date" in task &&
    "result_photos" in task &&
    "result_description" in task &&
    "spent_resources" in task
  );
};

export const formatDateDDMMYYYY = (input: string) => {
  const date = new Date(input);
  return date.toLocaleDateString("ru-RU");
};
