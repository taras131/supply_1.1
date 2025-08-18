import React, { FC } from "react";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { convertMillisecondsToDate } from "../../../utils/services";
import { useAppSelector } from "../../../hooks/redux";
import { getTaskById } from "../../machinery/model/selectors";
import { getUserFullNameById } from "../../users/model/selectors";
import { useNavigate } from "react-router-dom";

interface IProps {
  taskId: number;
}

const TaskReportItem: FC<IProps> = ({ taskId }) => {
  const navigate = useNavigate();
  const task = useAppSelector((state) => getTaskById(state, taskId));
  const assignedFullName = useAppSelector((state) => getUserFullNameById(state, task?.assigned_to_id || null));
  if (!task) return null;
  const viewTaskClickHandler = () => {
    navigate(`/machinery/${task.machinery_id}/task/${task.id}/`);
  };
  return (
    <ListItemButton onClick={viewTaskClickHandler}>
      <ListItemIcon>
        {task.status_id === 1 && <AssignmentIcon color="warning" />}
        {task.status_id === 2 && <BuildIcon color="primary" />}
        {task.status_id === 3 && <CheckCircleIcon color="success" />}
      </ListItemIcon>
      <ListItemText primary={convertMillisecondsToDate(task.created_date)} />
      <ListItemText color="primary" secondary={task.title} />
      <ListItemText
        color="primary"
        primary={task.status_id === 3 ? `${task.result_odometer} км. ${task.result_operating} ч.` : assignedFullName}
      />
    </ListItemButton>
  );
};

export default TaskReportItem;
