import React, { FC } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import ProblemDetails from "./ProblemDetails";
import { IMachineryProblem } from "../../../models/IMachineryProblems";
import { setCurrentProblem } from "../model/slice";
import StatusIcon from "../../machinery_tasks/ui/StatusIcon";
import Divider from "@mui/material/Divider";
import DueDateChip from "../../machinery_tasks/ui/DueDateChip";
import { StyledListItemButton } from "../../../styles/const";

interface IProps {
  problem: IMachineryProblem;
}

const RelatedProblemsItem: FC<IProps> = ({ problem }) => {
  const dispatch = useAppDispatch();
  if (!problem) return null;
  const problemClickHandler = () => {
    dispatch(setCurrentProblem(problem));
  };
  return (
    <>
      <ListItem key={problem.id} disablePadding>
        <StyledListItemButton
          onClick={(e) => {
            e.stopPropagation();
            problemClickHandler();
          }}
        >
          <ListItemIcon>
            <StatusIcon statusId={problem.status_id} />
          </ListItemIcon>
          <ListItemText primary={problem.title} />
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Stack sx={{ width: "75px", alignItems: "end" }}>
            <DueDateChip
              due_date={problem.status_id === 3 ? +problem.result_date : new Date(problem.created_at).getTime()}
              isCompleted={problem.status_id === 3}
              isShowIcon={false}
            />
            <Typography fontSize={"14px"}>
              {problem.operating ? `${problem.operating} ч.` : `${problem.odometer} км`}
            </Typography>
          </Stack>
        </StyledListItemButton>
      </ListItem>
      <ProblemDetails />
    </>
  );
};

export default RelatedProblemsItem;
