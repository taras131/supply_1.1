import { problemCategories } from "./const";
import { problemPriority, problemStatus } from "../../../models/IMachineryProblems";
import { IMachinery } from "../../../models/iMachinery";
import { MachineryStatus } from "../../../utils/const";

export const getCategoryTitleById = (id: number): string | undefined => {
  return problemCategories.find((category) => category.id === id)?.title;
};

export const getStatusTitleById = (id: number): string | undefined => {
  return problemStatus.find((status) => status.id === id)?.title;
};

export const getPriorityTitleById = (id: number): string | undefined => {
  return problemPriority.find((status) => status.id === id)?.title;
};

export const getPriorityChipColor = (priorityId: number): "primary" | "error" | "warning" => {
  switch (priorityId) {
    case 1: // Критично
      return "primary";
    case 2: // Важно
      return "warning";
    case 3: // Ждёт
      return "error";
    default: // Подстраховка от некорректных данных
      return "warning";
  }
};

export const getStatusChipColor = (status: MachineryStatus): "error" | "warning" | "success" => {
  switch (status) {
    case MachineryStatus.disActive:
      return "error";
    case MachineryStatus.repair:
      return "warning";
    case MachineryStatus.active:
      return "success";
    default:
      return "warning";
  }
};

const localeCompareSafe = (a: string, b: string) => {
  return a.localeCompare(b, ["ru", "en"], { sensitivity: "base" });
};
// Общая функция сортировки
export const sortMachineryList = (list: IMachinery[]): IMachinery[] => {
  return list.slice().sort((a, b) => {
    // Сортировка по type_id
    if (a.type_id !== b.type_id) return a.type_id - b.type_id;
    // По brand
    const brandCompare = localeCompareSafe(a.brand, b.brand);
    if (brandCompare !== 0) return brandCompare;
    // По model
    return localeCompareSafe(a.model, b.model);
  });
};
