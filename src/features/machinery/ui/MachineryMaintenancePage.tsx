import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchGetAllMachinery } from "../model/actions";
import { selectAllMachinery } from "../model/selectors";
import MachineryMaintenanceTable from "./MachineryMaintenanceTable";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const MachineryMaintenancePage = () => {
  const dispatch = useAppDispatch();
  const machinery = useAppSelector(selectAllMachinery);
  useEffect(() => {
    dispatch(fetchGetAllMachinery());
  }, []);
  return (
    <Stack spacing={4} sx={{width: "100%"}}>
      <Typography variant={"h1"} fontSize={"26px"}>
        Календарь проведения ТО
      </Typography>
      <MachineryMaintenanceTable rows={machinery} />
    </Stack>
  );
};

export default MachineryMaintenancePage;
