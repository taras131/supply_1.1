import React, { FC } from "react";
import { ListItem, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import StatusIcon from "./StatusIcon";
import { ITask } from "../../../models/IMachineryTasks";
import Divider from "@mui/material/Divider";
import DueDateChip from "./DueDateChip";
import { StyledListItemButton } from "../../../styles/const";

interface IProps {
  task: ITask;
  taskClickHandler: (e: any) => void;
  isMaintenanceMode: boolean;
}

const RelatedTasksItem: FC<IProps> = ({ task, taskClickHandler, isMaintenanceMode }) => {
  const maintenanceText = getMaintenanceText(task);
  return (
    <ListItem key={task.id} disablePadding>
      <StyledListItemButton onClick={taskClickHandler}>
        <ListItemIcon>
          <StatusIcon statusId={task.status_id} />
        </ListItemIcon>
        <ListItemText primary={task.title} />
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        <Stack sx={{ width: "65px", alignItems: "end" }}>
          <DueDateChip
            due_date={task.status_id === 3 ? +task.result_date : +task.due_date}
            isCompleted={task.status_id === 3}
            isShowIcon={false}
          />
          <Typography fontSize={"14px"}>{maintenanceText}</Typography>
        </Stack>
      </StyledListItemButton>
    </ListItem>
  );
};

export default RelatedTasksItem;

const getMaintenanceText = (task: ITask) => {
  if (task.status_id === 3) {
    return task.result_operating ? `${task.result_operating} ч.` : `${task.result_operating} км.`;
  }
  return task.issue_operating ? `${task.issue_operating} ч.` : `${task.issue_odometer} км.`;
};
