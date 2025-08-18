import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectAllMachinery} from "../model/selectors";
import MachineryPageHeader from "./MachineryPageHeader";
import {fetchGetAllMachinery} from "../model/actions";
import AMachineryMigration from "./AMachineryMigration";
import MachineryTable from "./MachineryTable";
import {Stack} from "@mui/material";

const MachineryPage = () => {
    const dispatch = useAppDispatch();
    const machinery = useAppSelector(selectAllMachinery);
    useEffect(() => {
        dispatch(fetchGetAllMachinery());
    }, [dispatch]);
    return (
        <Stack spacing={4} sx={{width: "100%"}}>
            <MachineryPageHeader/>
            <MachineryTable rows={machinery}/>
            <AMachineryMigration/>
        </Stack>
    );
};

export default MachineryPage;
