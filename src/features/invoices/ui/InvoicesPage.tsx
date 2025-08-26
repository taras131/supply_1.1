import React, {useEffect} from 'react';
import InvoicesPageHeader from "./InvoicesPageHeader";
import InvoicesTable from "./InvoicesTable";
import {Stack} from "@mui/material";
import AInvoicesMigration from "./AInvoicesMigration";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchGetAllInvoices} from "../model/actions";

const InvoicesPage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGetAllInvoices());
    }, [dispatch]);
    return (
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}>
            <InvoicesPageHeader/>
            <InvoicesTable/>
            <AInvoicesMigration/>
        </Stack>
    );
};

export default InvoicesPage;