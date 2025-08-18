import React, { FC } from "react";
import { MachineryStatus } from "../../../utils/const";
import { Chip } from "@mui/material";
import { getStatusChipColor } from "../utils/services";

interface IProps {
  status: MachineryStatus;
}

const MachineryStatusChip: FC<IProps> = ({ status }) => {
  return <Chip label={status} color={getStatusChipColor(status)} sx={{ width: "90px" }} />;
};

export default MachineryStatusChip;
