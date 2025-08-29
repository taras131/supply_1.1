import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectCurrentInvoice} from "../model/selectors";
import {fetchGetInvoiceById} from "../model/actions";
import {useParams} from "react-router-dom";
import {Stack} from "@mui/material";
import InvoiceDetailsPageHeader from "./InvoiceDetailsPageHeader";
import InvoiceDetailsStepper from "./InvoiceDetailsStepper";
import Box from "@mui/material/Box";
import InvoiceDetailsInfo from "./InvoiceDetailsInfo";

const InvoiceDetailsPage = () => {
    const dispatch = useAppDispatch();
    const invoiceId = useParams().invoiceId || "0";
    const invoice = useAppSelector(selectCurrentInvoice)
    console.log(invoiceId)
    useEffect(() => {
        dispatch(fetchGetInvoiceById(invoiceId))
    }, [dispatch, invoiceId])
    return (
        <Stack spacing={4} sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}>
            <InvoiceDetailsPageHeader/>
            <Box sx={{display: 'grid', gridTemplateColumns: '3fr 2fr ', gridGap: '24px'}}>
                <InvoiceDetailsInfo invoice={invoice}/>
                <InvoiceDetailsStepper invoice={invoice}/>
            </Box>
        </Stack>
    );
};

export default InvoiceDetailsPage;