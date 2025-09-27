import React from 'react';
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";
import BackButton from "../../../components/common/BackButton";

const OrderDetailsPageHeader = () => {
    return (
        <PageHeaderTemplate title={"Заявка"}>
          <BackButton/>
        </PageHeaderTemplate>
    );
};

export default OrderDetailsPageHeader;