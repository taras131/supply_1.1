import React from "react";
import Box from "@mui/material/Box";
import { useAppSelector } from "../../../hooks/redux";
import { selectCurrentCompany } from "../model/selectors";
import CompanyDetails from "./CompanyDetails";

const CompanyReport = () => {
  const currentCompany = useAppSelector(selectCurrentCompany);
  if (!currentCompany) return null;
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(min(500px, 100%), 1fr))",
        gap: "30px",
        marginTop: "18px",
      }}
    >
      <CompanyDetails company={currentCompany} />
      {/*   <UserAvatarDetails user={user}/>*/}
    </Box>
  );
};

export default CompanyReport;
