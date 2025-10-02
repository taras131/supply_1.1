import React from 'react';
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";
import BackButton from "../../../components/common/BackButton";

const ProblemDetailsPageHeader = () => {
    return (
        <PageHeaderTemplate title={"Проблема"}>
            <BackButton/>
        </PageHeaderTemplate>
    );
};

export default ProblemDetailsPageHeader;

