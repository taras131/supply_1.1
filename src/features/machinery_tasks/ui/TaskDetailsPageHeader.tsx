import React, { FC } from "react";
import { ButtonGroup, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { useAppDispatch } from "../../../hooks/redux";
import { fetchUpdateMachineryTask } from "../model/actions";
import { ITask } from "../../../models/IMachineryTasks";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";
import BackButton from "../../../components/common/BackButton";

interface IProps {
  currentTask: ITask;
}

const TaskDetailsPageHeader: FC<IProps> = ({ currentTask }) => {
  const dispatch = useAppDispatch();
  const statusChangeHandler = (statusId: number) => {
    dispatch(fetchUpdateMachineryTask({ ...currentTask, status_id: statusId }));
  };
  return (
    <PageHeaderTemplate title={"Задача"}>
      <Stack spacing={3}>
          <BackButton/>
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
    </PageHeaderTemplate>
  );
};

export default TaskDetailsPageHeader;
