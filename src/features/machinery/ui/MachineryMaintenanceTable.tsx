import React, { FC } from "react";
import { IMachinery } from "../../../models/iMachinery";
import BaseTable from "../../../components/common/BaseTable";
import { ITableColumn } from "../../../models/ITable";
import RelatedTasksItem from "../../machinery_tasks/ui/RelatedTasksItem";
import { routes } from "../../../utils/routes";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { EditableSpan } from "../../../components/common/EditableSpan";
import { useAppDispatch } from "../../../hooks/redux";
import { fetchUpdateMachinery } from "../model/actions";

interface IProps {
  rows: IMachinery[] | null;
}

const MachineryMaintenanceTable: FC<IProps> = ({ rows }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  if (!rows) return null;
  const columns: ITableColumn<IMachinery>[] = [
    {
      key: "brand",
      label: "Марка",
      getValue: (row) => <Link to={routes.machineryDetails.replace(":machineryId", row.id)}>{row.brand}</Link>,
    },
    {
      key: "model",
      label: "Модель",
      getValue: (row) => <Link to={routes.machineryDetails.replace(":machineryId", row.id)}>{row.model}</Link>,
    },
    {
      key: "state_number",
      label: "Гос. номер",
    },
    {
      key: "operating",
      label: "Наработка",
      getValue: (row) => (
        <EditableSpan
          value={row.operating}
          onChange={(newValue) => {
            if (newValue !== row.operating) {
              dispatch(fetchUpdateMachinery({ ...row, operating: newValue }));
            }
          }}
        />
      ),
    },
    {
      key: "odometer",
      label: "Пробег",
      getValue: (row) => (
        <EditableSpan
          value={row.odometer}
          onChange={(newValue) => {
            if (newValue !== row.odometer) {
              dispatch(fetchUpdateMachinery({ ...row, odometer: newValue }));
            }
          }}
        />
      ),
    },
    {
      key: "last_completed_service_task",
      label: "Последнее завершённое ТО",
      getValue: (row) => {
        const taskClickHandler = () => {
          navigate(routes.machineryTaskDetails.replace(":taskId", row.last_completed_service_task?.id || ""));
        };
        return (
          <>
            {row.last_completed_service_task ? (
              <RelatedTasksItem
                task={row.last_completed_service_task}
                taskClickHandler={taskClickHandler}
                isMaintenanceMode={true}
              />
            ) : (
              "Нет завершённых ТО"
            )}
          </>
        );
      },
    },
    {
      key: "next_service_task",
      label: "Предстоящее ТО",
      getValue: (row) => {
        const taskClickHandler = (e: any) => {
          e.stopPropagation();
          navigate(routes.machineryTaskDetails.replace(":taskId", row.next_service_task?.id || ""));
        };
        const plannedClickHandler = (e: any) => {
          e.stopPropagation();
          navigate(routes.machineryAddTask.replace(":machineryId", row.id), {
            state: { taskTypeId: 1 },
          });
        };
        return (
          <>
            {row.next_service_task ? (
              <RelatedTasksItem
                task={row.next_service_task}
                taskClickHandler={taskClickHandler}
                isMaintenanceMode={true}
              />
            ) : (
              <Button onClick={plannedClickHandler}>Запланировать</Button>
            )}
          </>
        );
      },
    },
  ];
  return <BaseTable rows={rows} columns={columns} />;
};

export default MachineryMaintenanceTable;
