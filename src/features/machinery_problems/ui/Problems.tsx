import React, { FC, useState } from "react";
import { Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import ProblemsTable from "./ProblemsTable";
import ProblemAddNew from "./ProblemAddNew";
import ProblemDetails from "./ProblemDetails";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { selectAllMachineryProblems } from "../model/selectors";
import { IMachineryProblem } from "../../../models/IMachineryProblems";
import { fetchGetMachineryProblemById } from "../model/actions";

interface IProps {
  isShowMachineryInfo?: boolean;
}

const Problems: FC<IProps> = ({ isShowMachineryInfo = false }) => {
  const dispatch = useAppDispatch();
  const [isOpenAddDrawer, setIsOpenAddDrawer] = useState(false);
  const problems = useAppSelector(selectAllMachineryProblems);
  const toggleIsOpenAddDrawer = () => {
    setIsOpenAddDrawer((prev) => !prev);
  };
  const handleProblemClick = (problem: IMachineryProblem) => {
    dispatch(fetchGetMachineryProblemById(problem.id));
  };
  return (
    <Stack spacing={4}>
      <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Замечания</Typography>
        <Button onClick={toggleIsOpenAddDrawer} startIcon={<AddIcon />} variant="contained">
          Добавить
        </Button>
      </Stack>
      <ProblemsTable rows={problems} onProblemClick={handleProblemClick} isShowMachineryInfo={isShowMachineryInfo} />
      <ProblemAddNew
        isOpen={isOpenAddDrawer}
        onClose={toggleIsOpenAddDrawer}
        isShowMachineryInfo={isShowMachineryInfo}
      />
      <ProblemDetails />
    </Stack>
  );
};

export default Problems;
