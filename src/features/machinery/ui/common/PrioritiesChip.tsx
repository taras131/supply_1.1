import React, { FC } from "react";
import { Chip } from "@mui/material";
import { getPriorityColor } from "../../../../utils/services";
import { PRIORITIES } from "../../utils/const";

interface IProps {
  priorityId: number;
  size?: "small" | "medium";
}

const PrioritiesChip: FC<IProps> = ({ priorityId, size = "small" }) => {
  const chipColor = getPriorityColor(priorityId);
  return (
    <Chip
      color={chipColor}
      label={PRIORITIES.find((priority) => priority.id === priorityId)?.title || ""}
      size={size}
    />
  );
};

export default PrioritiesChip;
