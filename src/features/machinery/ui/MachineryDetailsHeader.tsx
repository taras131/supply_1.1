import React, { FC } from "react";
import Button from "@mui/material/Button";
import { Stack, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../hooks/redux";
import { getCurrentMachineryTitle } from "../model/selectors";
import MachineryStatusButtons from "./MachineryStatusButtons";

const MachineryDetailsHeader: FC = () => {
  const matches_700 = useMediaQuery("(min-width:700px)");
  const navigate = useNavigate();
  const title = useAppSelector(getCurrentMachineryTitle);
  const handleBackClick = () => {
    navigate(-1);
  };
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Button onClick={handleBackClick} variant={"outlined"}>
        Назад
      </Button>
      <Typography
        variant="h2"
        color="primary"
        fontSize={matches_700 ? "24px" : "16px"}
        fontWeight={matches_700 ? 700 : 600}
      >
        {title}
      </Typography>
      <MachineryStatusButtons />
    </Stack>
  );
};

export default MachineryDetailsHeader;
