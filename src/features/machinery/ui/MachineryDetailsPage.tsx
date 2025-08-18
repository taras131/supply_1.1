import React, { useEffect } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import { useParams } from "react-router-dom";
import { Stack } from "@mui/material";
import { fetchGetMachineryById } from "../model/actions";
import MachineryDetailsHeader from "./MachineryDetailsHeader";
import MachineryDetailsTabs from "./MachineryDetailsTabs";

const MachineryDetailsPage = () => {
  const dispatch = useAppDispatch();
  const machineryId = useParams().machineryId || "0";
  useEffect(() => {
    if (machineryId) {
      dispatch(fetchGetMachineryById(machineryId));
    }
  }, [dispatch, machineryId]);
  return (
    <Stack sx={{ maxWidth: "1350px", width: "100%", marginLeft: "auto", marginRight: "auto" }} spacing={4}>
      <MachineryDetailsHeader />
      <MachineryDetailsTabs />
    </Stack>
  );
};

export default MachineryDetailsPage;
