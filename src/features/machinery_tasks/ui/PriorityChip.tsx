import React, { FC } from "react";
import { getPriorityChipColor, getPriorityTitleById } from "../../machinery/utils/services";
import { Chip } from "@mui/material";

interface IProps {
  priorityId: number;
}

const PriorityChip: FC<IProps> = ({ priorityId }) => {
  const priorityColor = getPriorityChipColor(priorityId);
  return <Chip label={getPriorityTitleById(priorityId)} color={priorityColor} sx={{ width: "85px" }} />;
};

export default PriorityChip;
