import React, {useEffect} from "react";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchGetAllOrders} from "../model/actions";
import OrdersTable from "./OrdersTable";
import OrdersPageHeader from "./OrdersPageHeader";
import {Stack} from "@mui/material";
import AOrdersMigration from "./AOrderMigration";

const OrdersPage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGetAllOrders());
    }, [dispatch]);
    return (
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}>
            <OrdersPageHeader/>
            <OrdersTable/>
            <AOrdersMigration/>
        </Stack>
    );
};

export default OrdersPage;
