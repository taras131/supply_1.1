import React from "react";
import {useAppSelector} from "../../../hooks/redux";
import {selectShipments} from "../model/selectors";
import ShipmentsHelper from "./ShipmentsHelper";
import {Stack, Typography} from "@mui/material";
import ShipmentsPageHeader from "./ShipmentsPageHeader";
import ShipmentsList from "./ShipmentsList";


const ShipmentsPage = () => {
    const shipments = useAppSelector(selectShipments);
    return (
        <Stack sx={{
            width: '100%',
            maxWidth: {sm: '100%', md: '1700px'},
            pt: 1.5,
        }}>
            <ShipmentsPageHeader/>
            {shipments.length
                ? (<ShipmentsList shipments={shipments}/>)
                : (<Typography pb={4} pt={4} fontSize={28}>
                    ничего не найдено, измените условия поиска
                </Typography>)}
            <ShipmentsHelper/>
        </Stack>
    );
};

export default ShipmentsPage;
