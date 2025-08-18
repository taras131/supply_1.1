import React, { FC, useState } from "react";
import Box from "@mui/material/Box";
import { Tab, Tabs } from "@mui/material";
import UserReport from "../../users/ui/UserReport";
import CompanyReport from "../../companies/ui/CompanyReport";
import { a11yProps, CustomTabPanel } from "../../../components/common/CustomTabPanel";

const ProfileTabs: FC = () => {
  const [value, setValue] = useState<number>(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Личные данные" {...a11yProps(0)} />
          <Tab label="Компания" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserReport />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <CompanyReport />
      </CustomTabPanel>
    </Box>
  );
};

export default ProfileTabs;
