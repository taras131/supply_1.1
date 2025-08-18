import React, { ChangeEvent, FC } from "react";
import { INewTask, ITask } from "../../../models/IMachineryTasks";
import { ValidationErrors } from "../../../utils/validators";
import { SelectChangeEvent, Stack } from "@mui/material";
import FieldControl from "../../../components/common/FieldControl";

interface IProps {
  task: INewTask | ITask | null;
  errors?: ValidationErrors;
  isEditMode?: boolean;
  fieldChangeHandler: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>,
  ) => void;
}

const TaskResultView: FC<IProps> = ({ task, errors, isEditMode = false, fieldChangeHandler }) => {
  if (!task || !("result_description" in task) || !("result_spent_resources" in task)) return null;
  return (
    <Stack direction="column" spacing={2.5} mt={2}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <FieldControl
          label="Наработка (часы)"
          name="result_operating"
          id="result_operating"
          value={task.result_operating}
          error={errors?.result_operating}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
        />
        <FieldControl
          label="Пробег (километры)"
          name="result_odometer"
          id="result_odometer"
          value={task.result_odometer}
          error={errors?.result_odometer}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
        />
      </Stack>
      <FieldControl
        label="Результат"
        name="result_description"
        id="result_description"
        value={task.result_description}
        error={errors?.result_description}
        isEditMode={isEditMode}
        onChange={fieldChangeHandler}
        isRequired
        isMultiline
      />
      <FieldControl
        label="Потраченные материалы"
        name="result_spent_resources"
        id="result_spent_resources"
        value={task.result_spent_resources}
        error={errors?.result_spent_resources}
        isEditMode={isEditMode}
        onChange={fieldChangeHandler}
        isRequired
        isMultiline
      />
    </Stack>
  );
};

export default TaskResultView;
