import React, { FC } from "react";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";
import Button from "@mui/material/Button";
import { fetchOut } from "../model/actions";

const ProfileHeader: FC = () => {
  const dispatch = useAppDispatch();
  const matches_700 = useMediaQuery("(min-width:700px)");
  const handleOutClick = () => {
    dispatch(fetchOut());
  };
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography
        variant="h2"
        color="primary"
        fontSize={matches_700 ? "24px" : "16px"}
        fontWeight={matches_700 ? 700 : 600}
      >
        Профиль:
      </Typography>
      <Button onClick={handleOutClick} variant={"outlined"}>
        Выход
      </Button>
    </Stack>
  );
};

export default ProfileHeader;
