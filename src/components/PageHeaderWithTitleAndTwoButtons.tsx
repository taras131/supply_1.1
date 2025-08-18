import React, { FC } from "react";
import { Button, Stack, Typography, useMediaQuery } from "@mui/material";
import { CENTER, LARGE, ROW, SMALL, SPACE_BETWEEN } from "../styles/const";

interface IProps {
  leftButtonText: string;
  rightButtonText: string;
  title: string;
  handleLeftButtonClick: () => void;
  handleRightButtonClick: () => void;
  isLeftButtonDisabled?: boolean;
  isRightButtonDisabled?: boolean;
}

const PageHeaderWithTitleAndTwoButtons: FC<IProps> = ({
  leftButtonText,
  rightButtonText,
  title,
  handleLeftButtonClick,
  handleRightButtonClick,
  isLeftButtonDisabled = false,
  isRightButtonDisabled = false,
}) => {
  const matches_700 = useMediaQuery("(min-width:700px)");
  const matches_500 = useMediaQuery("(min-width:500px)");
  //    const isAuth = useAppSelector(state => getIsAuth(state));
  return (
    <Stack sx={{ width: "100%", position: "relative" }} alignItems={CENTER} justifyContent={CENTER} spacing={2}>
      <Stack sx={{ width: "100%" }} direction={ROW} alignItems={CENTER} justifyContent={SPACE_BETWEEN} spacing={1}>
        <Button
          variant="outlined"
          size={matches_700 ? LARGE : SMALL}
          onClick={handleLeftButtonClick}
          disabled={isLeftButtonDisabled}
        >
          {leftButtonText}
        </Button>
        {matches_500 && (
          <Typography variant="h2" fontSize={matches_700 ? "24px" : "16px"} fontWeight={matches_700 ? 700 : 600}>
            {title}
          </Typography>
        )}
        <Stack spacing={1}>
          <Button
            variant="contained"
            size={matches_700 ? LARGE : SMALL}
            onClick={handleRightButtonClick}
            disabled={isRightButtonDisabled}
          >
            {rightButtonText}
          </Button>
        </Stack>
      </Stack>
      {!matches_500 && (
        <Typography variant="h2" fontSize={matches_700 ? "24px" : "16px"} fontWeight={matches_700 ? 700 : 600}>
          {title}
        </Typography>
      )}
      {isRightButtonDisabled && (
        <Typography fontSize={12} fontWeight={600} sx={{ position: "absolute", right: 0, top: "-40px" }}>
          Не все поля заполнены
        </Typography>
      )}
    </Stack>
  );
};

export default PageHeaderWithTitleAndTwoButtons;
