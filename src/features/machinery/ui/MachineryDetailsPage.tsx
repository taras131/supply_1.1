import React, {useEffect} from "react";
import {useAppDispatch} from "../../../hooks/redux";
import {useParams} from "react-router-dom";
import {Stack} from "@mui/material";
import {fetchGetMachineryById} from "../model/actions";
import MachineryDetailsHeader from "./MachineryDetailsHeader";
import MachineryDetailsTabs from "./MachineryDetailsTabs";

const MachineryDetailsPage = () => {
    const dispatch = useAppDispatch();
    const machineryId = useParams().machineryId || "0";
    useEffect(() => {
        if (machineryId) {
            dispatch(fetchGetMachineryById(machineryId));
        }
    }, [dispatch, machineryId]);
    return (
        <Stack spacing={4} sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}>
            <MachineryDetailsHeader/>
            <MachineryDetailsTabs/>
        </Stack>
    );
};

export default MachineryDetailsPage;
