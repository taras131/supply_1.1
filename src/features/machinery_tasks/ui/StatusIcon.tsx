import React, { FC } from "react";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import BuildIcon from "@mui/icons-material/Build";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface IProps {
  statusId: number;
}

const StatusIcon: FC<IProps> = ({ statusId }) => {
  if (statusId === 3) return <CheckCircleIcon color="success" />;
  if (statusId === 2) return <BuildIcon color="primary" />;
  return <HourglassBottomIcon color="error" />;
};

export default StatusIcon;
