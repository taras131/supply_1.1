import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {fetchGetAllMachinery} from "../model/actions";
import {selectAllMachinery} from "../model/selectors";
import MachineryMaintenanceTable from "./MachineryMaintenanceTable";
import PageTemplate from "../../../components/templates/PageTemplate";
import PageHeaderTemplate from "../../../components/templates/PageHeaderTemplate";

const MachineryMaintenancePage = () => {
    const dispatch = useAppDispatch();
    const machinery = useAppSelector(selectAllMachinery);
    useEffect(() => {
        dispatch(fetchGetAllMachinery());
    }, [dispatch]);
    return (
        <PageTemplate>
            <PageHeaderTemplate title={"Календарь проведения ТО"}/>
            <MachineryMaintenanceTable rows={machinery}/>
        </PageTemplate>
    );
};

export default MachineryMaintenancePage;
