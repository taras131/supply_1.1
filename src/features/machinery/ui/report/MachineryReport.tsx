import React, { FC } from "react";
import Box from "@mui/material/Box";
import MachineryDetailsPhotos from "../MachineryDetailsPhotos";
import MachineryReportSummary from "./MachineryReportSummary";
import MachineryView from "../MachineryView";
import MachineryReportMaintenance from "./MachineryReportMaintenance";

const MachineryReport: FC = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(500px, 100%), 1fr))",
        gap: "16px",
      }}
    >
      <MachineryView />
      <MachineryReportSummary />
      <MachineryReportMaintenance />
      <MachineryDetailsPhotos />
    </Box>
  );
};

export default MachineryReport;
