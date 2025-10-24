import React from 'react';
import {a11yProps, CustomTabPanel} from "../../../components/common/CustomTabPanel";
import Box from "@mui/material/Box";
import {MyTab, MyTabs} from "../../../styles/theme/customizations/MyTabs";
import ShipmentsSection from "../../shipments/ui/ShipmentsSection";
import OrderPositionsTableForInvoice from "../../orders_positions/ui/OrderPositionsTableForInvoice";
import InvoicesComments from "../../invoices_comments/ui/InvoicesComments";
import {useAppSelector} from "../../../hooks/redux";
import {selectInvoicesCommentsCount} from "../../invoices_comments/model/selectors";
import {Badge, Stack} from "@mui/material";

const InvoiceDetailsTabs = () => {
    const [value, setValue] = React.useState(0);
    const commentsCount = useAppSelector(selectInvoicesCommentsCount)
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                <MyTabs value={value} onChange={handleChange} aria-label="invoice tabs">
                    <MyTab label="Связаные заявки" {...a11yProps(0)} />
                    <MyTab label="Связанные отгрузки" {...a11yProps(1)} />
                    <MyTab label={
                        <Stack direction={"row"}
                               spacing={1}
                               alignItems={"center"}
                               sx={{width: "80px"}}>
                            Заметки
                            {commentsCount !== null && (
                                <Badge
                                    badgeContent={commentsCount}
                                    color="primary"
                                    overlap="circular"
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            right: -15,
                                        }
                                    }}
                                />
                            )}
                        </Stack>
                    }
                           {...a11yProps(2)} />
                </MyTabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <OrderPositionsTableForInvoice/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <ShipmentsSection invoiceMode/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <InvoicesComments/>
            </CustomTabPanel>
        </Box>
    );
};

export default InvoiceDetailsTabs;