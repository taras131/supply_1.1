import React from 'react';
import {a11yProps, CustomTabPanel} from "../../../components/common/CustomTabPanel";
import Box from "@mui/material/Box";
import {MyTab, MyTabs} from "../../../styles/theme/customizations/MyTabs";
import ShipmentsSection from "../../shipments/ui/ShipmentsSection";
import OrderPositionsTableForInvoice from "../../orders_positions/ui/OrderPositionsTableForInvoice";

const InvoiceDetailsTabs = () => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <MyTabs value={value} onChange={handleChange} aria-label="invoice tabs">
                    <MyTab label="Связаные заявки" {...a11yProps(0)} />
                    <MyTab label="Связанные отгрузки" {...a11yProps(1)} />
                </MyTabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <OrderPositionsTableForInvoice/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <ShipmentsSection invoiceMode/>
            </CustomTabPanel>
        </Box>
    );
};

export default InvoiceDetailsTabs;