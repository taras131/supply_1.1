import React, {useEffect} from 'react';
import TechnicalLiteraturePageHeader from "./TechnicalLiteraturePageHeader";
import PageTemplate from "../../../components/templates/PageTemplate";
import TechnicalLiteratureTable from "./TechnicalLiteratureTable";
import {useAppDispatch} from "../../../hooks/redux";
import {fetchGetAllTechnicalLiterature} from "../model/actions";
import TechnicalLiteratureDetails from "./TechnicalLiteratureDetails";

const TechnicalLiteraturePage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGetAllTechnicalLiterature())
    }, [dispatch])
    return (
        <PageTemplate>
            <TechnicalLiteraturePageHeader/>
            <TechnicalLiteratureTable/>
            <TechnicalLiteratureDetails/>
        </PageTemplate>
    );
};

export default TechnicalLiteraturePage;