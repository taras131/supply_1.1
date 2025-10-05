import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectCurrentInvoice} from "../model/selectors";
import {fetchGetInvoiceById} from "../model/actions";
import {useParams} from "react-router-dom";
import InvoiceDetailsPageHeader from "./InvoiceDetailsPageHeader";
import InvoiceDetailsStepper from "./InvoiceDetailsStepper";
import Box from "@mui/material/Box";
import InvoiceDetailsInfo from "./InvoiceDetailsInfo";
import InvoiceDetailsTabs from "./InvoiceDetailsTabs";
import PageTemplate from "../../../components/templates/PageTemplate";

const InvoiceDetailsPage = () => {
    const dispatch = useAppDispatch();
    const invoiceId = useParams().invoiceId || "0";
    const invoice = useAppSelector(selectCurrentInvoice)
    useEffect(() => {
        dispatch(fetchGetInvoiceById(invoiceId))
    }, [dispatch, invoiceId])
    return (
        <PageTemplate authOnly>
            <InvoiceDetailsPageHeader/>
            <Box sx={{display: 'grid', gridTemplateColumns: '3fr 2fr ', gridGap: '24px'}}>
                <InvoiceDetailsInfo invoice={invoice}/>
                <InvoiceDetailsStepper invoice={invoice}/>
            </Box>
            <InvoiceDetailsTabs/>
        </PageTemplate>
    );
};

export default InvoiceDetailsPage;