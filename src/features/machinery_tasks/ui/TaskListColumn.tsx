import React from "react";
import { useDrop } from "react-dnd";
import { ITask } from "../../../models/IMachineryTasks";
import TaskCard from "./TaskCard";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { Link, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { routes } from "../../../utils/routes";

interface TasksColumnProps {
  status: { id: number; title: string };
  tasks: ITask[];
  moveTask: (taskId: string, newStatusId: number) => void;
  isShowMachineryInformation?: boolean;
}

const TasksColumn: React.FC<TasksColumnProps> = ({ status, tasks, moveTask, isShowMachineryInformation }) => {
  const machineryId = useParams().machineryId || "-1";
  const [, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string }) => moveTask(item.id, status.id),
  });
  return (
    <Stack
      ref={drop}
      spacing={1}
      style={{
        backgroundColor: "#f0f0f0",
        padding: "16px",
        borderRadius: "8px",
        flex: "1",
        minHeight: "300px",
        border: "1px solid #ccc",
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <h3>{status.title}</h3>
        {status.id === 1 && (
          <Button
            component={Link}
            to={routes.machineryAddTask.replace(":machineryId", machineryId)}
            startIcon={<AddIcon sx={{ fontSize: "var(--icon-fontSize-md)" }} />}
            variant="contained"
            size="small"
          >
            Добавить
          </Button>
        )}
      </Stack>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} isShowMachineryInformation={isShowMachineryInformation} />
      ))}
    </Stack>
  );
};

export default TasksColumn;
