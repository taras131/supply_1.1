import React, { FC } from "react";
import { Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { convertMillisecondsToDateWithTextMonths } from "../../../utils/services";
import dayjs from "dayjs";

const getDueDateColors = (due_date: number, isCompleted: boolean) => {
  if (!due_date || isCompleted) return { icon: "info", text: "info.main" };
  const today = dayjs().startOf("day"); // обнуляем время
  const dueDate = dayjs(+due_date).startOf("day"); // обнуляем время
  if (today.isAfter(dueDate)) return { icon: "error", text: "error.main" }; // ПРОСРОЧЕНО
  if (today.isSame(dueDate)) return { icon: "warning", text: "warning.main" }; // СЕГОДНЯ
  if (today.add(1, "day").isSame(dueDate)) return { icon: "success", text: "success.main" }; // ЗАВТРА
  return { icon: "success", text: "success.main" };
};

interface IProps {
  due_date: number | string;
  isCompleted: boolean;
  isShowIcon?: boolean;
}

const DueDateChip: FC<IProps> = ({ due_date, isCompleted, isShowIcon = true }) => {
  const { icon, text } = getDueDateColors(+due_date, isCompleted);
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {isShowIcon && (
        <>{isCompleted ? <CheckCircleIcon color={icon as any} /> : <AccessTimeIcon color={icon as any} />}</>
      )}
      <Typography fontWeight={650} fontSize="14px" sx={{ color: text }}>
        {convertMillisecondsToDateWithTextMonths(+due_date)}
      </Typography>
    </Stack>
  );
};

export default DueDateChip;
