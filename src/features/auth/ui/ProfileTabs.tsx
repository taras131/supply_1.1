import React, {FC, useState} from "react";
import Box from "@mui/material/Box";
import UserReport from "../../users/ui/UserReport";
import CompanyReport from "../../companies/ui/CompanyReport";
import {a11yProps, CustomTabPanel} from "../../../components/common/CustomTabPanel";
import {MyTab, MyTabs} from "../../../styles/theme/customizations/MyTabs";
import PasswordChange from "./PasswordChange";

const ProfileTabs: FC = () => {
    const [value, setValue] = useState<number>(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Box sx={{width: "100%"}}>
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <MyTabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <MyTab label="Личные данные" {...a11yProps(0)} />
                    <MyTab label="Компания" {...a11yProps(1)} />
                    <MyTab label="Смена пароля" {...a11yProps(2)} />
                </MyTabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <UserReport/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <CompanyReport/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <PasswordChange/>
            </CustomTabPanel>
        </Box>
    );
};

export default ProfileTabs;
