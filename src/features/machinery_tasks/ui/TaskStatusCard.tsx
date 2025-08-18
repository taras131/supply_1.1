import React, { FC } from "react";
import Card from "@mui/material/Card";
import TitleWithValue from "../../../components/TitleWithValue";
import { ITask } from "../../../models/IMachineryTasks";
import CreateUpdateUserInfo from "../../../components/common/CreateUpdateUserInfo";
import { useAppSelector } from "../../../hooks/redux";
import { selectCurrentMachineryTitle } from "../../machinery/model/selectors";
import DueDateChip from "./DueDateChip";
import { convertMillisecondsToDate } from "../../../utils/services";
import { Link } from "react-router-dom";
import { routes } from "../../../utils/routes";

interface IProps {
  currentTask: ITask;
}

const TaskStatusCard: FC<IProps> = ({ currentTask }) => {
  const currentMachineryTitle = useAppSelector(selectCurrentMachineryTitle);
  return (
    <Card
      sx={{
        padding: "24px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(250px, 100%), 1fr))",
        gap: "24px",
      }}
    >
      <TitleWithValue title={"Срок выполнения:"}>
        <DueDateChip due_date={+currentTask.due_date} isCompleted={!!Number(currentTask.result_date)} />
      </TitleWithValue>
      {currentTask.status_id === 3 && currentTask.result_date && (
        <TitleWithValue title={"Завершена:"} value={convertMillisecondsToDate(+currentTask.result_date)} />
      )}
      <Link to={routes.machineryDetails.replace(":machineryId", currentTask.machinery_id)}>
        <TitleWithValue title={"Техника:"} value={currentMachineryTitle} />
      </Link>
      <CreateUpdateUserInfo
        author={currentTask.author}
        createdAT={currentTask.created_at}
        updatedAuthor={currentTask.updated_author ?? null}
        updatedAt={currentTask.updated_at || null}
      />
    </Card>
  );
};

export default TaskStatusCard;
