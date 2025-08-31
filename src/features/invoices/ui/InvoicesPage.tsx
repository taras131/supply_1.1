import React, {useEffect, useState} from 'react';
import InvoicesPageHeader from "./InvoicesPageHeader";
import InvoicesTable from "./InvoicesTable";
import {Stack} from "@mui/material";
import AInvoicesMigration from "./AInvoicesMigration";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchGetAllInvoices, TInvoiceFilter} from "../model/actions";

const InvoicesPage = () => {
    const dispatch = useAppDispatch();
    const [filterValue, setFilterValue] = useState<TInvoiceFilter>("all");
    const filterChangeHandler = (e: TInvoiceFilter) => {
        setFilterValue(e)
    }
    useEffect(() => {
        dispatch(fetchGetAllInvoices(filterValue));
    }, [dispatch, filterValue]);
    return (
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}>
            <InvoicesPageHeader/>
            <InvoicesTable filterValue={filterValue}
                           filterChangeHandler={filterChangeHandler}
            />
            <AInvoicesMigration/>
        </Stack>
    );
};

export default InvoicesPage;