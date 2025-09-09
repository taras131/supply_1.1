import React, {FC, useState, memo} from "react";
import {
    Box,
    Stack,
} from "@mui/material";
import ShipmentShow from "./ShipmentShow";
import ShipmentsSectionInvoices from "./ShipmentsSectionInvoices";
import ShipmentsSectionNavigation from "./ShipmentsSectionNavigation";
import {useAppSelector} from "../../../hooks/redux";
import {selectShipmentById} from "../model/selectors";

const ShipmentsSection: FC = () => {
    const [activeShipmentId, setActiveShipmentId] = useState<string | null>(null);
    const activeShipment = useAppSelector(state => selectShipmentById(state, activeShipmentId));
    return (
        <Box sx={{display: 'flex', gap: 2, mt: 2, width: '100%'}}>
            {/* Левая колонка: список отгрузок */}
            <ShipmentsSectionNavigation activeShipmentId={activeShipmentId}
                                        setActiveShipmentId={setActiveShipmentId}/>
            {/* Правая колонка */}
            <Stack spacing={3} sx={{width: '100%'}}>
                <ShipmentShow shipment={activeShipment}/>
                {activeShipment && (
                    <>
                        <ShipmentsSectionInvoices activeShipment={activeShipment}/>
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default memo(ShipmentsSection);