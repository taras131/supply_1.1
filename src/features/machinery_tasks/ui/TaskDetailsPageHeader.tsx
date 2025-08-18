import React, { FC } from "react";
import { ButtonGroup, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useAppDispatch } from "../../../hooks/redux";
import { useNavigate } from "react-router-dom";
import { fetchUpdateMachineryTask } from "../model/actions";
import { ITask } from "../../../models/IMachineryTasks";

interface IProps {
  currentTask: ITask;
}

const TaskDetailsPageHeader: FC<IProps> = ({ currentTask }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const statusChangeHandler = (statusId: number) => {
    dispatch(fetchUpdateMachineryTask({ ...currentTask, status_id: statusId }));
  };
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Button variant="outlined" onClick={() => navigate(-1)}>
        Назад
      </Button>
      <Typography variant="h1" fontSize={"24px"} textAlign="center">
        Задача
      </Typography>
      <ButtonGroup size="small" aria-label="Small button group">
        <Button variant={currentTask.status_id === 1 ? "contained" : "outlined"} onClick={() => statusChangeHandler(1)}>
          Новая
        </Button>
        <Button variant={currentTask.status_id === 2 ? "contained" : "outlined"} onClick={() => statusChangeHandler(2)}>
          В работе
        </Button>
        <Button variant={currentTask.status_id === 3 ? "contained" : "outlined"} onClick={() => statusChangeHandler(3)}>
          Завершена
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default TaskDetailsPageHeader;
