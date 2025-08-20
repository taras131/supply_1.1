import React, { FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Tab, Tabs } from "@mui/material";
import MachineryDocs from "../../machinery_docs/ui/MachineryDocs";
import { useAppSelector } from "../../../hooks/redux";
import { selectCurrentMachinery } from "../model/selectors";
import { TaskList } from "../../machinery_tasks/ui/TasksList";
import Problems from "../../machinery_problems/ui/Problems";
import MachineryReport from "./report/MachineryReport";
import { useLocation, useNavigate } from "react-router-dom";
import { a11yProps, CustomTabPanel } from "../../../components/common/CustomTabPanel";
import MachineryComments from "../../machinery_comments/ui/MachineryComments";
import OrdersTable from "../../orders/ui/OrdersTable";
import {MyTab, MyTabs} from "../../../styles/theme/customizations/MyTabs";

const MachineryDetailsTabs: FC = () => {
  const machinery = useAppSelector(selectCurrentMachinery);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTab = parseInt(queryParams.get("tab") || "0", 10);
  const [value, setValue] = useState<number>(initialTab);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(`?tab=${newValue}`, { replace: true });
  };
  useEffect(() => {
    setValue(initialTab);
  }, [initialTab]);
  if (!machinery) {
    return null;
  }
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <MyTabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <MyTab label="Обзор" {...a11yProps(0)} />
          <MyTab label="Документы" {...a11yProps(1)} />
          <MyTab label="Проблемы" {...a11yProps(2)} />
          <MyTab label="Задачи" {...a11yProps(3)} />
          <MyTab label="Заявки" {...a11yProps(4)} />
          <MyTab label="Заметки" {...a11yProps(5)} />
        </MyTabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <MachineryReport />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MachineryDocs />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Problems />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <TaskList />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        <OrdersTable/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <MachineryComments />
      </CustomTabPanel>
    </Box>
  );
};

export default MachineryDetailsTabs;
