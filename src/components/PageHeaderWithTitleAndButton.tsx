import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Stack, Typography, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { LARGE, SMALL } from "../styles/const";

interface IProps {
  route: string;
  title: string;
  buttonText: string;
  icon?: React.ReactNode | false;
  maxWidth?: string;
}

const PageHeaderWithTitleAndButton: FC<IProps> = ({ route, title, buttonText, icon = false, maxWidth = "1350px" }) => {
  const navigate = useNavigate();
  const matches_700 = useMediaQuery("(min-width:700px)");
  const handleAddClick = () => {
    navigate(route);
  };
  return (
    <Stack
      sx={{ maxWidth: maxWidth, width: "100%" }}
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Typography variant="h2" fontSize={matches_700 ? "24px" : "18px"} fontWeight={matches_700 ? 700 : 600}>
        {title}
      </Typography>
      <Button
        startIcon={icon ? icon : <AddIcon />}
        variant="contained"
        size={matches_700 ? LARGE : SMALL}
        onClick={handleAddClick}
      >
        {buttonText}
      </Button>
    </Stack>
  );
};

export default PageHeaderWithTitleAndButton;
