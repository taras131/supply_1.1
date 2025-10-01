import React from "react";
import Card from "@mui/material/Card";
import { useAppSelector } from "../../../../hooks/redux";
import { selectCurrentMachineryId } from "../../model/selectors";
import { selectMachineryMaintenanceTasks } from "../../../machinery_tasks/model/selectors";
import RelatedTasks from "../../../machinery_tasks/ui/RelatedTasks";

const MachineryReportMaintenance = () => {
  const currentMachineryId = useAppSelector(selectCurrentMachineryId);
  const maintenances = useAppSelector(selectMachineryMaintenanceTasks);
  return (
    <Card sx={{ padding: "24px" }}>
      <RelatedTasks tasks={maintenances}
                    title={"TO:"}
                    machineryId={currentMachineryId || "-1"} isMaintenanceMode />
    </Card>
  );
};

export default MachineryReportMaintenance;
