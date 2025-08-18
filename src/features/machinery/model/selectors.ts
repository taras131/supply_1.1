import { RootState } from "../../../store";
import { ICurrentMachinery, IMachinery } from "../../../models/iMachinery";
import { useAppSelector } from "../../../hooks/redux";
import { IOrder } from "../../../models/iOrders";
import { ITask } from "../../../models/IMachineryTasks";
import { createSelector } from "@reduxjs/toolkit";

const collator = new Intl.Collator("ru");

const selectMachineryState = (state: RootState) => state.machinery;

export const selectAllMachinery = createSelector([selectMachineryState], (machineryState) => machineryState.list);

export const selectMachineryIsLoading = createSelector([selectMachineryState], (machineryState) => machineryState.isLoading);

export const selectAllMachineryForOptions = createSelector([selectMachineryState], (machineryState) =>
  machineryState.list.map((machinery) => ({
    id: machinery.id,
    title: `${machinery.brand} ${machinery.model} ${machinery.state_number}`,
  })),
);

export const selectCurrentMachinery = createSelector(
  [selectMachineryState],
  (machineryState) => machineryState.current,
);

export const selectCurrentMachineryId = createSelector(
  [selectMachineryState],
  (machineryState) => machineryState.current?.id,
);

export const selectCurrentMachineryPhotos = createSelector(
  [selectMachineryState],
  (machineryState) => machineryState.current?.photos,
);

export const selectCurrentMachineryTitle = createSelector([selectMachineryState], (machineryState) =>
  machineryState.current ? `${machineryState.current.brand} ${machineryState.current.model}` : "",
);

export const getMachineryIsLoading = (state: RootState): boolean => {
  return state.machinery.isLoading;
};

export const getMachinery = (state: RootState): (IMachinery | ICurrentMachinery)[] => {
  return state.machinery.list;
};

export const getMachineryById = (state: RootState, machineryId: number): IMachinery | ICurrentMachinery => {
  return state.machinery.list.filter((machinery) => machinery.id !== machineryId)[0];
};

export const getCurrentMachinery = (state: RootState): ICurrentMachinery | null => {
  return state.machinery.current;
};

export const getCurrentMachineryTitle = (state: RootState): string => {
  const currentMachinery = getCurrentMachinery(state);
  if (currentMachinery) {
    return `${currentMachinery.brand} ${currentMachinery.model}`;
  } else {
    return "";
  }
};
export const getCurrentMachineryOperatingTypeId = (state: RootState): number | null => {
  return state.machinery.current?.operating_type_id || null;
};

export const getTaskById = (state: RootState, taskId: number): ITask | null => {
  return state.machinery.current?.tasks.find((task) => task.id === taskId) || null;
};

export const getRelatedMachineryByInvoiceId = (state: RootState, invoiceId: string): IMachinery[] => {
  const relatedMachinery: IMachinery[] = [];
  const relatedOrders: IOrder[] = [];
  state.orders.list.forEach((order) => {
    const include = order.orderItems.some((orderItems) => orderItems.invoiceId && orderItems.invoiceId === invoiceId);
    if (include) {
      relatedOrders.push(order);
    }
  });
  if (relatedOrders.length > 0) {
    const relatedMachineryIds: string[] = [];
    relatedOrders.forEach((relatedOrder) => {
      if (relatedOrder.machineryId && relatedOrder.machineryId.length > 0) {
        relatedMachineryIds.push(relatedOrder.machineryId);
      }
    });
    if (relatedMachineryIds.length > 0) {
      relatedMachineryIds.forEach((relatedMachineryId) => {
        const machinery = useAppSelector((state) => getMachineryById(state, +relatedMachineryId));
        relatedMachinery.push(machinery[0]);
      });
    }
  }
  return relatedMachinery;
};
