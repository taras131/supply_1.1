import React, { FC } from "react";
import { formatDateDDMMYYYY } from "../../../utils/services";
import { getCategoryTitleById } from "../../machinery/utils/services";
import { ITableColumn } from "../../../models/ITable";
import BaseTable from "../../../components/common/BaseTable";
import { useAppSelector } from "../../../hooks/redux";
import { getCurrentMachineryOperatingTypeId } from "../../machinery/model/selectors";
import Box from "@mui/material/Box";
import { IMachineryProblem } from "../../../models/IMachineryProblems";
import StatusIcon from "../../machinery_tasks/ui/StatusIcon";
import PriorityChip from "../../machinery_tasks/ui/PriorityChip";

interface IProps {
  rows: IMachineryProblem[] | null;
  onProblemClick: (problem: IMachineryProblem) => void;
  isShowMachineryInfo: boolean;
  activeRowId?: number | null;
}

const ProblemsTable: FC<IProps> = ({ rows, onProblemClick, isShowMachineryInfo, activeRowId = null }) => {
  const operatingTypeId = useAppSelector(getCurrentMachineryOperatingTypeId);
  if (!rows) return null;
  const rowClickHandler = (problem: IMachineryProblem) => {
    onProblemClick(problem);
  };
  const columns: ITableColumn<IMachineryProblem>[] = [
    {
      key: "status_id",
      label: "Статус",
      getValue: (row) => (
        <Box display="flex" alignItems="center" justifyContent="center">
          <StatusIcon statusId={row.status_id} />
        </Box>
      ),
    },
    {
      key: "created_at",
      label: "Дата",
      getValue: (row) => row.created_at,
      formatter: (value) => formatDateDDMMYYYY(value),
    },
    {
      key: "operating",
      label: operatingTypeId === 0 ? "Наработка (часы)" : "Пробег (км)",
    },
    {
      key: "category_id",
      label: "Категория",
      getValue: (row) => getCategoryTitleById(row.category_id),
    },
    {
      key: "title",
      label: "Заголовок",
    },
    {
      key: "description",
      label: "Описание",
    },
    {
      key: "priority_id",
      label: "Приоритет",
      getValue: (row) => <PriorityChip priorityId={row.priority_id} />,
    },
  ];
  if (isShowMachineryInfo) {
    columns.splice(2, 0, {
      key: "machinery",
      label: "Техника",
      getValue: (row) => `${row.machinery?.brand} ${row.machinery?.model}`,
    });
  }
  return <BaseTable rows={rows} columns={columns} onRowClick={rowClickHandler} activeRowId={activeRowId} />;
};

export default ProblemsTable;
