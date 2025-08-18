import React, { ChangeEvent, FC, useEffect, useState } from "react";
import Card from "@mui/material/Card";
import TaskDetailsPhotos from "./TaskDetailsPhotos";
import TaskIssueView from "./TaskIssueView";
import TaskResultView from "./TaskResultView";
import ButtonsEditCancelSave from "../../../components/common/ButtonsEditCancelSave";
import { ITask } from "../../../models/IMachineryTasks";
import { ValidationErrors } from "../../../utils/validators";
import { SelectChangeEvent, Typography } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";
import { fetchUpdateMachineryTask } from "../model/actions";

interface IProps {
  editedValue: ITask | null;
  fieldChangeHandler: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>,
  ) => void;
  handleDateChange: (date: any) => void;
  viewType: "issue" | "result";
  isOnEditMode?: boolean;
  errors?: ValidationErrors;
}

const TaskReport: FC<IProps> = ({
  editedValue,
  errors,
  fieldChangeHandler,
  handleDateChange,
  viewType,
  isOnEditMode = false,
}) => {
  const dispatch = useAppDispatch();
  const [isEditMode, setIsEditMode] = useState(false);
  useEffect(() => {
    if (isOnEditMode) {
      setIsEditMode(true);
    }
  }, [isOnEditMode]);
  if (!editedValue) return null;
  const toggleIsEditMode = () => {
    setIsEditMode((prev) => !prev);
  };
  const saveTaskClickHandler = () => {
    const updatedTask = viewType === "result" ? { ...editedValue, status_id: 3 } : editedValue;
    dispatch(fetchUpdateMachineryTask(updatedTask));
    setIsEditMode(false);
  };
  return (
    <>
      <Card
        sx={{
          position: "relative",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography sx={{ marginBottom: "16px" }} variant="h5" color="primary">
          {viewType === "issue" ? "Задача:" : "Результат:"}
        </Typography>
        {viewType === "issue" ? (
          <TaskIssueView
            isEditMode={isEditMode}
            task={editedValue}
            fieldChangeHandler={fieldChangeHandler}
            handleDateChange={handleDateChange}
            errors={errors}
          />
        ) : (
          <TaskResultView
            isEditMode={isEditMode}
            task={editedValue}
            fieldChangeHandler={fieldChangeHandler}
            errors={errors}
          />
        )}
        <ButtonsEditCancelSave
          isEditMode={isEditMode}
          isValid={!errors || !Object.keys(errors).length}
          toggleIsEditMode={toggleIsEditMode}
          updateHandler={saveTaskClickHandler}
          cancelUpdateHandler={toggleIsEditMode}
        />
      </Card>
      <TaskDetailsPhotos
        viewType={viewType}
        photos={viewType === "issue" ? editedValue.issue_photos : editedValue.result_photos}
      />
    </>
  );
};

export default TaskReport;
