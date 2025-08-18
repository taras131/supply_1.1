import React, {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectAllMachinery} from "../model/selectors";
import MachineryTable from "./MachineryTable";
import MachineryPageHeader from "./MachineryPageHeader";
import {fetchGetAllMachinery} from "../model/actions";
import {useNavigate} from "react-router-dom";
import {routes} from "../../../utils/routes";
import {IMachinery} from "../../../models/iMachinery";
import AMachineryMigration from "./AMachineryMigration";
import Box from "@mui/material/Box";
import MachineryNewTable from "./MachineryNewTable";

const MachineryPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const machinery = useAppSelector(selectAllMachinery);
    const machineryClickHandler = (machinery: IMachinery) => {
        navigate(`${routes.machinery}/${machinery.id}`);
    };
    useEffect(() => {
        dispatch(fetchGetAllMachinery());
    }, []);
    return (
        <Box sx={{width: '100%', maxWidth: {sm: '100%', md: '1700px'}}}>
            <MachineryPageHeader/>
            {/* <CustomersFilters />*/}
            <MachineryNewTable rows={machinery}/>
            <AMachineryMigration/>
        </Box>
    );
};

export default MachineryPage;
