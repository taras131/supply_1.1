import { Avatar, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { nestServerPath } from "../../../api";

interface IProps {
  name: string;
  role?: string;
  photo: string;
}

const PerformerChip: FC<IProps> = ({ name, role = "исполнитель", photo }) => {
  return (
    <Stack direction={"row"} alignItems={"center"} justifyContent={"center"} spacing={1}>
      <Avatar
        alt={name}
        src={`${nestServerPath}/static/${photo}`}
        sx={{
          width: 40,
          height: 40,
          fontSize: 22,
        }}
      />
      <Stack alignItems={"start"} justifyContent={"center"}>
        <Typography variant="caption" color="textSecondary" sx={{ fontSize: 12 }}>
          {role}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: 14 }}>
          {name}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default PerformerChip;
