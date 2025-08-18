import React, { FC } from "react";
import { ButtonGroup, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { IMachineryProblem, problemStatus } from "../../../models/IMachineryProblems";
import { fetchUpdateMachineryProblem } from "../model/actions";
import { useAppDispatch } from "../../../hooks/redux";

interface IProps {
  currentProblem: IMachineryProblem;
}

const ProblemDetailsHeader: FC<IProps> = ({ currentProblem }) => {
  const dispatch = useAppDispatch();
  const statusChangeHandler = (statusId: number) => {
    let updatedProblem = { ...currentProblem };
    if (currentProblem.status_id === 3 && statusId < 3) {
      updatedProblem = { ...updatedProblem, result_date: 0 };
    }
    dispatch(fetchUpdateMachineryProblem({ ...updatedProblem, status_id: statusId }));
  };
  return (
    <Stack direction="row" spacing={2} justifyContent={"space-between"} alignItems={"center"}>
      <Typography variant={"h5"} sx={{ marginBottom: "16px" }}>
        Детали:
      </Typography>
      <ButtonGroup size="small" aria-label="Small button group">
        <Button
          variant={currentProblem.status_id === 1 ? "contained" : "outlined"}
          onClick={() => statusChangeHandler(1)}
        >
          {problemStatus[0].title}
        </Button>
        <Button
          variant={currentProblem.status_id === 2 ? "contained" : "outlined"}
          onClick={() => statusChangeHandler(2)}
        >
          {problemStatus[1].title}
        </Button>
        <Button
          variant={currentProblem.status_id === 3 ? "contained" : "outlined"}
          onClick={() => statusChangeHandler(3)}
        >
          {problemStatus[2].title}
        </Button>
      </ButtonGroup>
    </Stack>
  );
};

export default ProblemDetailsHeader;
