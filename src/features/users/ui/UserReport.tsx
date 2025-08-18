import React, { FC } from "react";
import Box from "@mui/material/Box";
import UserDetails from "./UserDetails";
import UserAvatarDetails from "./UserAvatarDetails";
import { useAppSelector } from "../../../hooks/redux";
import { selectCurrentUser } from "../model/selectors";

const UserReport: FC = () => {
  const user = useAppSelector(selectCurrentUser);
  if (!user) return null;
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(500px, 100%), 1fr))",
        gap: "30px",
        marginTop: "18px",
      }}
    >
      <UserDetails user={user} />
      <UserAvatarDetails user={user} />
    </Box>
  );
};

export default UserReport;
