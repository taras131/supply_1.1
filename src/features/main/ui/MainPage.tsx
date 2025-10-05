import React from 'react';
import PageTemplate from "../../../components/templates/PageTemplate";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";
import InvoicesStatistics from "./InvoicesStatistics";

const MainPage = () => {
    return (
        <PageTemplate authOnly>
            <PageHeaderTemplate title={"Главная"}/>
            <InvoicesStatistics/>
        </PageTemplate>
    );
};

export default MainPage;