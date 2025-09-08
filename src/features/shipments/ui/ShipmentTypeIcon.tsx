import React, {FC} from 'react';
import {Stack, Tooltip} from "@mui/material";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";
import {TShipmentsType} from "../../../models/iShipments";

interface IProps {
    type: TShipmentsType
    received: boolean
}

const ShipmentTypeIcon:FC<IProps> = ({type, received}) => {
    return (
        <Stack direction="row" spacing={1} sx={{flexShrink: 0}}>
            {type === 'air' ? (
                <Tooltip title="Авиа отправка">
                    <AirplanemodeActiveIcon color={received ? 'success' : 'warning'}/>
                </Tooltip>
            ) : (
                <Tooltip title="ЖД отправка">
                    <DirectionsSubwayIcon color={received ? 'success' : 'warning'}/>
                </Tooltip>
            )}
        </Stack>
    );
};

export default ShipmentTypeIcon;