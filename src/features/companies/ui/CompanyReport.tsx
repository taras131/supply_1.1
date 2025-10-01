import React from "react";
import { useAppSelector } from "../../../hooks/redux";
import { selectCurrentCompany } from "../model/selectors";
import CompanyDetails from "./CompanyDetails";
import DetailsGrid from "../../../components/templates/DetailsGrid";

const CompanyReport = () => {
  const currentCompany = useAppSelector(selectCurrentCompany);
  if (!currentCompany) return null;
  return (
    <DetailsGrid>
      <CompanyDetails company={currentCompany} />
      {/*   <UserAvatarDetails user={user}/>*/}
    </DetailsGrid>
  );
};

export default CompanyReport;
