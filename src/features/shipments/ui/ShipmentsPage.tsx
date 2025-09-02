import React, {useEffect} from "react";
import {useAppDispatch} from "../../../hooks/redux";
import ShipmentsHelper from "./ShipmentsHelper";
import {Stack} from "@mui/material";
import ShipmentsPageHeader from "./ShipmentsPageHeader";
import {fetchGetAllShipment} from "../model/actions";
import AShipmentsMigration from "./AShipmentsMigration";
import ShipmentsSection from "./ShipmentsSection";


const ShipmentsPage = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(fetchGetAllShipment());
    }, [dispatch]);
    return (
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}>
            <ShipmentsPageHeader/>
            <ShipmentsSection/>
            <ShipmentsHelper/>
            <AShipmentsMigration/>
        </Stack>
    );
};

export default ShipmentsPage;
