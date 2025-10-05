import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useEditor } from "../../../hooks/useEditor";
import { defaultTask, ITask } from "../../../models/IMachineryTasks";
import { taskValidate } from "../../../utils/validators";
import { selectCurrentTask } from "../model/selectors";
import { fetchGetMachineryTasksById } from "../model/actions";
import { fetchGetMachineryById } from "../../machinery/model/actions";
import Box from "@mui/material/Box";
import TaskDetailsPageHeader from "./TaskDetailsPageHeader";
import TaskReport from "./TaskReport";
import TaskStatusCard from "./TaskStatusCard";
import PageTemplate from "../../../components/templates/PageTemplate";

const TaskDetailsPage = () => {
  const dispatch = useAppDispatch();
  const { taskId } = useParams();
  const currentTask = useAppSelector(selectCurrentTask);
  const { editedValue, errors, handleFieldChange, setEditedValue, validateValue } = useEditor<ITask>({
    initialValue: JSON.parse(JSON.stringify(defaultTask)),
    validate: taskValidate,
  });
  useEffect(() => {
    if (taskId) {
      dispatch(fetchGetMachineryTasksById(`${taskId}`));
    }
  }, [taskId,  dispatch]);
  useEffect(() => {
    if (currentTask && currentTask.machinery_id) {
      dispatch(fetchGetMachineryById(currentTask.machinery_id));
      setEditedValue(currentTask);
      validateValue();
    }
  }, [currentTask, dispatch]);
  if (!currentTask) return null;
  const handleDateChange = (date: any) => {
    if (date && date.isValid && date.isValid()) {
      setEditedValue((prev) => ({
        ...prev,
        due_date: date.toDate().getTime(),
      }));
    }
  };
  return (
    <PageTemplate authOnly>
      <TaskDetailsPageHeader currentTask={currentTask} />
      <TaskStatusCard currentTask={currentTask} />
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(500px, 100%), 1fr))",
          gap: "16px",
        }}
      >
        <TaskReport
          editedValue={editedValue}
          fieldChangeHandler={handleFieldChange}
          handleDateChange={handleDateChange}
          errors={errors}
          viewType="issue"
        />
        {currentTask && currentTask.status_id === 3 && (
          <TaskReport
            editedValue={editedValue}
            fieldChangeHandler={handleFieldChange}
            handleDateChange={handleDateChange}
            errors={errors}
            viewType="result"
            isOnEditMode={!currentTask.result_date}
          />
        )}
      </Box>
    </PageTemplate>
  );
};

export default TaskDetailsPage;
