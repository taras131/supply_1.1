import React, {useEffect} from "react";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchGetAllOrders} from "../model/actions";
import OrdersTable from "./OrdersTable";
import OrdersPageHeader from "./OrdersPageHeader";
import AOrdersMigration from "./AOrderMigration";
import PageTemplate from "../../../components/templates/PageTemplate";

const OrdersPage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGetAllOrders());
    }, [dispatch]);
    return (
        <PageTemplate>
            <OrdersPageHeader/>
            <OrdersTable/>
            <AOrdersMigration/>
        </PageTemplate>
    );
};

export default OrdersPage;
