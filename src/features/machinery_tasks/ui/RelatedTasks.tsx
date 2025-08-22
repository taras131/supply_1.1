import React, { FC } from "react";
import { ITask } from "../../../models/IMachineryTasks";
import { IconButton, List, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { routes } from "../../../utils/routes";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useAppDispatch } from "../../../hooks/redux";
import { setCurrentProblem } from "../../machinery_problems/model/slice";
import RelatedTasksItem from "./RelatedTasksItem";
import Divider from "@mui/material/Divider";

interface IProps {
  machineryId: string;
  problemId?: string;
  tasks: ITask[] | null;
  title?: string;
  isMaintenanceMode?: boolean;
}

const RelatedTasks: FC<IProps> = ({ tasks, machineryId, problemId, title, isMaintenanceMode = false }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const taskClickHandler = (taskId: string) => () => {
    navigate(routes.machineryTaskDetails.replace(":taskId", taskId));
    dispatch(setCurrentProblem(null));
  };
  const addTaskClickHandler = () => {
    navigate(routes.machineryAddTask.replace(":machineryId", machineryId), {
      state: { problemId: problemId ?? "-1", taskTypeId: isMaintenanceMode ? 1 : "-1" },
    });
  };
  const tasksList = tasks?.map((task) => (
    <>
      <RelatedTasksItem
        key={task.id}
        task={task}
        isMaintenanceMode={isMaintenanceMode}
        taskClickHandler={taskClickHandler(task.id)}
      />
      <Divider color={"white"} component="li" />
    </>
  ));
  return (
    <Stack>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Typography component={"h4"} fontWeight={500} color="primary">
          {title ?? "Связанные задачи:"}
        </Typography>
        <IconButton onClick={addTaskClickHandler} aria-label="add_task" color="primary">
          <AddBoxIcon fontSize="inherit" />
        </IconButton>
      </Stack>
      {tasksList && tasksList.length > 0 ? (
        <List>
          {tasksList}
        </List>
      ) : (
        <Typography variant={"subtitle2"}>
          {isMaintenanceMode ? " Нет связанных ТО." : "Нет связанных задач."}
        </Typography>
      )}
    </Stack>
  );
};

export default RelatedTasks;
