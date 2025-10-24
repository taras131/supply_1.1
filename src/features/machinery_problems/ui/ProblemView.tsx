import React, { ChangeEvent, FC } from "react";
import FieldControl from "../../../components/common/FieldControl";
import { problemCategories } from "../../machinery/utils/const";
import { convertMillisecondsToDate } from "../../../utils/services";
import {
  IMachineryProblem,
  INewMachineryProblem,
  problemPriority,
} from "../../../models/IMachineryProblems";
import { ValidationErrors } from "../../../utils/validators";
import { SelectChangeEvent, Stack } from "@mui/material";
import TitleWithValue from "../../../components/TitleWithValue";

interface IProps {
  problem: INewMachineryProblem | IMachineryProblem | null;
  errors?: ValidationErrors;
  isEditMode?: boolean;
  fieldChangeHandler: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>,
  ) => void;
}

const ProblemView: FC<IProps> = ({ problem, errors, isEditMode, fieldChangeHandler }) => {
  if (!problem) return null;
  return (
    <>
      <Stack direction={"row"} spacing={2}>
        <FieldControl
          label="Наработка (часы)"
          name="operating"
          id="operating"
          value={problem.operating}
          error={errors?.operating}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
        />
        <FieldControl
          label="Пробег (километры)"
          name="odometer"
          id="odometer"
          value={problem.odometer}
          error={errors?.odometer}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
        />
      </Stack>
      <Stack direction={"row"} spacing={2}>
        <FieldControl
          label="Категория"
          name="category_id"
          id="category_id"
          value={problem.category_id}
          error={errors?.category_id}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          options={problemCategories}
          isRequired
        />
        <FieldControl
          label="Приоритет"
          name="priority_id"
          id="priority_id"
          value={problem.priority_id}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          options={problemPriority}
        />
      </Stack>
      <FieldControl
        label="Заголовок"
        name="title"
        id="title"
        value={problem.title}
        error={errors?.title}
        isEditMode={isEditMode}
        onChange={fieldChangeHandler}
        isRequired
      />
      <FieldControl
        label="Описание"
        name="description"
        id="description"
        value={problem.description}
        error={errors?.description}
        isEditMode={isEditMode}
        onChange={fieldChangeHandler}
        isMultiline
        isRequired
        sx={{
          flexGrow: 1,
          height: "100%",
        }}
      />
      {problem && problem.status_id === 3 && "result_date" in problem && (
        <TitleWithValue title={"Закрыта"} value={convertMillisecondsToDate(+problem.result_date)} />
      )}
    </>
  );
};

export default ProblemView;
