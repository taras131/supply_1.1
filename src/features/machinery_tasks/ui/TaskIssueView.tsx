import React, { ChangeEvent, FC } from "react";
import { ValidationErrors } from "../../../utils/validators";
import { SelectChangeEvent, Stack, Typography } from "@mui/material";
import { INewTask, ITask, taskStatus, taskTypes } from "../../../models/IMachineryTasks";
import FieldControl from "../../../components/common/FieldControl";
import { PRIORITIES } from "../../machinery/utils/const";
import { useAppSelector } from "../../../hooks/redux";
import { selectUsersFromOptions } from "../../users/model/selectors";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { selectActiveProblemsFromOptions } from "../../machinery_problems/model/selectors";
import { selectAllMachineryForOptions } from "../../machinery/model/selectors";
import RelatedProblemsItem from "../../machinery_problems/ui/RelatedProblemsItem";

interface IProps {
  task: INewTask | ITask | null;
  errors?: ValidationErrors;
  isEditMode?: boolean;
  isNewTask?: boolean;
  handleDateChange: (date: any) => void;
  fieldChangeHandler: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>,
  ) => void;
}

const TaskIssueView: FC<IProps> = ({
  task,
  errors,
  isEditMode = true,
  isNewTask = false,
  fieldChangeHandler,
  handleDateChange,
}) => {
  const usersList = useAppSelector(selectUsersFromOptions);
  const activeProblemList = useAppSelector(selectActiveProblemsFromOptions);
  const machineryOptions = useAppSelector(selectAllMachineryForOptions);
  if (!task) return null;
  return (
    <Stack direction="column" spacing={2.5}>
      {isNewTask && machineryOptions.length > 0 && (
        <FieldControl
          label="Техника"
          name="machinery_id"
          id="machinery_id"
          value={task.machinery_id}
          error={errors?.machinery_id}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          options={machineryOptions}
        />
      )}
      <Stack direction="row" spacing={2} alignItems={"center"} mt={1}>
        <FieldControl
          label="Место проведения работ"
          name="event_location"
          id="event_location"
          value={task.event_location}
          error={errors?.event_location}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          sx={{ marginTop: "20px" }}
        />
        {isEditMode && (
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DatePicker
              label="Срок выполнения"
              value={dayjs(+task.due_date)}
              onChange={handleDateChange}
              format="DD.MM.YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: "outlined",
                },
              }}
            />
          </LocalizationProvider>
        )}
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <FieldControl
          label="Приоритет"
          name="priority_id"
          id="priority_id"
          value={task.priority_id}
          error={errors?.priority_id}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          options={PRIORITIES}
          isRequired
        />
        <FieldControl
          label="Тип работ"
          name="type_id"
          id="type_id"
          value={task.type_id}
          error={errors?.type_id}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          options={taskTypes}
        />
      </Stack>
      <Stack direction="row" spacing={2}>
        {isNewTask && (
          <FieldControl
            label="Основание"
            name="problem_id"
            id="problem_id"
            value={task.problem_id ?? "-1"}
            error={errors?.problem_id}
            isEditMode={isEditMode}
            onChange={fieldChangeHandler}
            options={activeProblemList}
          />
        )}
        <FieldControl
          label="Исполнитель"
          name="assigned_to_id"
          id="assigned_to_id"
          value={task.assigned_to_id ?? "-1"}
          error={errors?.assigned_to_id}
          isEditMode={isEditMode}
          onChange={fieldChangeHandler}
          options={usersList}
        />
      </Stack>
      {task.type_id === 1 && (
        <Stack direction={"row"} spacing={2}>
          <FieldControl
            label="Провести ТО при наработке (час)"
            name="issue_operating"
            id="issue_operating"
            value={task.issue_operating}
            error={errors?.issue_operating}
            isEditMode={isEditMode}
            onChange={fieldChangeHandler}
          />
          <FieldControl
            label=" Провести ТО при пробеге (километры)"
            name="issue_odometer"
            id="issue_odometer"
            value={task.issue_odometer}
            error={errors?.issue_odometer}
            isEditMode={isEditMode}
            onChange={fieldChangeHandler}
          />
        </Stack>
      )}
      <FieldControl
        label="Заголовок"
        name="title"
        id="title"
        value={task.title}
        error={errors?.title}
        isEditMode={isEditMode}
        onChange={fieldChangeHandler}
        isRequired
      />
      <FieldControl
        label="Описание"
        name="description"
        id="description"
        value={task.description}
        error={errors?.description}
        isEditMode={isEditMode}
        onChange={fieldChangeHandler}
        isRequired
        isMultiline
      />
      {!isEditMode && "problem" in task && task.problem && (
        <Stack>
          <Typography variant={"subtitle2"}>Основание:</Typography>
          <RelatedProblemsItem problem={task.problem} />
        </Stack>
      )}
    </Stack>
  );
};

export default TaskIssueView;
