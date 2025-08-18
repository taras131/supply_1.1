import React, { useEffect } from "react";
import { TaskList } from "./TasksList";
import { useAppDispatch } from "../../../hooks/redux";
import { fetchGetAllMachineryTasks } from "../model/actions";
import { useMediaQuery } from "@mui/material";

const TasksPage = () => {
  const dispatch = useAppDispatch();
  //   const isMobile = useMediaQuery(theme => theme.breakpoints.down("sm"));
  useEffect(() => {
    dispatch(fetchGetAllMachineryTasks());
  }, []);
  return <TaskList isShowMachineryInformation />;
};

export default TasksPage;
