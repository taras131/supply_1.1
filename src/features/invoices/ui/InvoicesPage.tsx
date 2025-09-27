import React, {useCallback, useEffect, useState} from 'react';
import InvoicesPageHeader from "./InvoicesPageHeader";
import InvoicesTable from "./InvoicesTable";
import AInvoicesMigration from "./AInvoicesMigration";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchGetAllInvoices, TInvoiceFilter} from "../model/actions";
import PageTemplate from "../../../components/templates/PageTemplate";

const InvoicesPage = () => {
    const dispatch = useAppDispatch();
    const [filterValue, setFilterValue] = useState<TInvoiceFilter>("all");
    const filterChangeHandler = useCallback((e: TInvoiceFilter) => {
        setFilterValue(e)
    }, [])
    useEffect(() => {
        dispatch(fetchGetAllInvoices(filterValue));
    }, [dispatch, filterValue]);
    return (
        <PageTemplate>
            <InvoicesPageHeader/>
            <InvoicesTable filterValue={filterValue}
                           filterChangeHandler={filterChangeHandler}
            />
            <AInvoicesMigration/>
        </PageTemplate>
    );
};

export default InvoicesPage;