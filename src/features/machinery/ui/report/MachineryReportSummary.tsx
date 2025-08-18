import React from "react";
import { selectCurrentMachineryId } from "../../model/selectors";
import { useAppSelector } from "../../../../hooks/redux";
import Card from "@mui/material/Card";
import { selectLastMachineryProblems } from "../../../machinery_problems/model/selectors";
import { selectLastMachineryRepairTasks } from "../../../machinery_tasks/model/selectors";
import RelatedTasks from "../../../machinery_tasks/ui/RelatedTasks";
import RelatedProblems from "../../../machinery_problems/ui/RelatedProblems";
import { Stack } from "@mui/material";

const MachineryReportSummary = () => {
  const currentMachineryId = useAppSelector(selectCurrentMachineryId);
  const problems = useAppSelector(selectLastMachineryProblems);
  const tasks = useAppSelector(selectLastMachineryRepairTasks);
  return (
    <Card sx={{ padding: "24px" }}>
      <Stack spacing={2}>
        <RelatedProblems problems={problems} title={"Последние проблемы:"} />
        <RelatedTasks title={"Последние ремонты:"} machineryId={currentMachineryId || "-1"} tasks={tasks} />
      </Stack>
    </Card>
  );
};

export default MachineryReportSummary;
