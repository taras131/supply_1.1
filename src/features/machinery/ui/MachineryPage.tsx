import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectAllMachinery} from "../model/selectors";
import MachineryPageHeader from "./MachineryPageHeader";
import {fetchGetAllMachinery} from "../model/actions";
import AMachineryMigration from "./AMachineryMigration";
import MachineryTable from "./MachineryTable";
import PageTemplate from "../../../components/templates/PageTemplate";

const MachineryPage = () => {
    const dispatch = useAppDispatch();
    const machinery = useAppSelector(selectAllMachinery);
    useEffect(() => {
        dispatch(fetchGetAllMachinery());
    }, [dispatch]);
    return (
        <PageTemplate>
            <MachineryPageHeader/>
            <MachineryTable rows={machinery}/>
            <AMachineryMigration/>
        </PageTemplate>
    );
};

export default MachineryPage;
