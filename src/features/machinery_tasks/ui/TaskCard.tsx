import React, { FC } from "react";
import { Card, CardContent, CardActions, Stack, Typography, IconButton } from "@mui/material";
import { getTaskTypeById, ITask } from "../../../models/IMachineryTasks";
import { useDrag } from "react-dnd";
import Box from "@mui/material/Box";
import { routes } from "../../../utils/routes";
import { useNavigate } from "react-router-dom";
import PriorityChip from "./PriorityChip";
import DueDateChip from "./DueDateChip";
import PerformerChip from "../../users/ui/PerformerChip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Divider from "@mui/material/Divider";

interface IProps {
  task: ITask;
  isShowMachineryInformation?: boolean;
}

const TaskCard: FC<IProps> = ({ task, isShowMachineryInformation = false }) => {
  const navigate = useNavigate();
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const isITask = (t: any): t is ITask => "id" in t;
  const handleNavigateToDetails = () => {
    navigate(routes.machineryTaskDetails.replace(":taskId", task.id.toString()));
  };
  return (
    <Card
      ref={drag}
      style={{
        borderRadius: "4px",
        backgroundColor: isDragging ? "#d3d3d3" : "white",
        height: isDragging ? 0 : "auto",
        cursor: "pointer",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <DueDateChip due_date={task.due_date} isCompleted={task.status_id === 3} />
          <Typography fontWeight={650} fontSize="14px" color={task.type_id === 1 ? "info.main" : "warning.main"}>
            {getTaskTypeById(task.type_id)}
          </Typography>
          <IconButton onClick={handleNavigateToDetails} color="info" aria-label="show more">
            <MoreVertIcon />
          </IconButton>
        </Stack>
        <Stack direction={"row"} justifyContent={"space-between"} mt={2} alignItems={"center"}>
          <Typography variant="h4" fontSize={"16px"}>
            {task.title}
          </Typography>
          {task.machinery && isShowMachineryInformation && (
            <Stack direction="row" alignItems={"center"}>
              <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
              <Typography variant={"subtitle2"} fontSize={"14px"}>
                {`${task.machinery.brand} ${task.machinery.model}`}
              </Typography>
            </Stack>
          )}
        </Stack>
        <Box sx={{ height: "60px", overflowY: "hidden", marginTop: 1.5 }}>
          <Typography fontWeight={400} variant="body2">
            {task.description}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Stack sx={{ width: "100%" }} direction="row" alignItems="center" justifyContent="space-between">
          {isITask(task) && task.assigned_to && (
            <PerformerChip
              name={`${task.assigned_to.first_name} ${task.assigned_to.middle_name}`}
              photo={task.assigned_to.avatar_path}
            />
          )}
          <PriorityChip priorityId={task.priority_id} />
        </Stack>
      </CardActions>
    </Card>
  );
};

export default TaskCard;
