import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {fetchGetAllOrders} from "../model/actions";
import {selectAllOrders} from "../model/selectors";
import OrdersTable from "./OrdersTable";
import OrdersPageHeader from "./OrdersPageHeader";
import {Stack} from "@mui/material";

const OrdersPage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGetAllOrders());
    }, [dispatch]);
    const orders = useAppSelector(selectAllOrders);
    return (
        <Stack spacing={4} sx={{width: "100%"}}>
            <OrdersPageHeader/>
            <OrdersTable rows={orders}/>
        </Stack>
    );
};

export default OrdersPage;
