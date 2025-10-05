import React, {useEffect} from "react";
import {useAppDispatch} from "../../../hooks/redux";
import {useParams} from "react-router-dom";
import {fetchGetMachineryById} from "../model/actions";
import MachineryDetailsHeader from "./MachineryDetailsHeader";
import MachineryDetailsTabs from "./MachineryDetailsTabs";
import PageTemplate from "../../../components/templates/PageTemplate";

const MachineryDetailsPage = () => {
    const dispatch = useAppDispatch();
    const machineryId = useParams().machineryId || "0";
    useEffect(() => {
        if (machineryId) {
            dispatch(fetchGetMachineryById(machineryId));
        }
    }, [dispatch, machineryId]);
    return (
        <PageTemplate authOnly>
            <MachineryDetailsHeader/>
            <MachineryDetailsTabs/>
        </PageTemplate>
    );
};

export default MachineryDetailsPage;
