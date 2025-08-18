import React, { FC } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TasksColumn from "./TaskListColumn";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchUpdateMachineryTask } from "../model/actions";
import { selectAllMachineryTasks } from "../model/selectors";
import { taskStatus } from "../../../models/IMachineryTasks";

interface IProps {
  isShowMachineryInformation?: boolean;
}

export const TaskList: FC<IProps> = ({ isShowMachineryInformation }) => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectAllMachineryTasks);
  const moveTask = (taskId: string, newStatusId: number) => {
    if (tasks.length) {
      const updatedTasks = { ...tasks.filter((task) => task.id === taskId)[0] };
      dispatch(fetchUpdateMachineryTask({ ...updatedTasks, status_id: newStatusId }));
    }
  };
  if (!tasks) return null;
  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          display: "flex",
          minHeight: "690px",
          gap: "16px",
          padding: "16px",
        }}
      >
        {taskStatus.map((status) => (
          <TasksColumn
            key={status.id}
            status={status}
            tasks={tasks
              .filter((task) => task.status_id === status.id)
              .sort((a, b) => new Date(+a.due_date).getTime() - new Date(+b.due_date).getTime())}
            moveTask={moveTask}
            isShowMachineryInformation={isShowMachineryInformation}
          />
        ))}
      </div>
    </DndProvider>
  );
};
