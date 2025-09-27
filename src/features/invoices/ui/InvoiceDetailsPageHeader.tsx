import React from 'react';
import BackButton from "../../../components/common/BackButton";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";

const InvoiceDetailsPageHeader = () => {
    return (
        <PageHeaderTemplate title={"Счёт"}>
            <BackButton/>
        </PageHeaderTemplate>
    );
};

export default InvoiceDetailsPageHeader;