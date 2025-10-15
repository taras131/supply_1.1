import React from 'react';
import PageTemplate from "../../../components/templates/PageTemplate";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";
import InvoicesStatistics from "./InvoicesStatistics";
import ShipmentsStatistics from "../../shipments/ui/ShipmentsStatistics";

const MainPage = () => {
    return (
        <PageTemplate authOnly>
            <PageHeaderTemplate title={"Главная"}/>
            <InvoicesStatistics/>
            <ShipmentsStatistics/>
        </PageTemplate>
    );
};

export default MainPage;