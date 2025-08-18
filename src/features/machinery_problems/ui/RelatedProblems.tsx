import React, { FC, useState } from "react";
import { IMachineryProblem } from "../../../models/IMachineryProblems";
import { IconButton, List, Stack, Typography } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RelatedProblemsItem from "./RelatedProblemsItem";
import ProblemAddNew from "./ProblemAddNew";

interface IProps {
  problems: IMachineryProblem[];
  title?: string;
}

const RelatedProblems: FC<IProps> = ({ problems, title }) => {
  const [isOpenAddDrawer, setIsOpenAddDrawer] = useState(false);
  const toggleIsOpenAddDrawer = () => {
    setIsOpenAddDrawer((prev) => !prev);
  };
  const problemsList = problems.map((problem) => <RelatedProblemsItem key={problem.id} problem={problem} />);
  return (
    <Stack>
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
        <Typography component={"h4"} fontWeight={500} color="primary">
          {title ?? "Связанные проблемы:"}
        </Typography>
        <IconButton onClick={toggleIsOpenAddDrawer} aria-label="add_problem" color="primary">
          <AddBoxIcon fontSize="inherit" />
        </IconButton>
      </Stack>
      {problemsList && problemsList.length > 0 ? (
        <List> {problemsList} </List>
      ) : (
        <Typography variant={"subtitle2"}>Нет связанных проблем.</Typography>
      )}
      <ProblemAddNew isOpen={isOpenAddDrawer} onClose={toggleIsOpenAddDrawer} isShowMachineryInfo={false} />
    </Stack>
  );
};

export default RelatedProblems;
