import React, {FC, memo, useCallback, useMemo} from 'react';
import {ListItemButton, ListItemText, Stack, Tooltip, Typography} from "@mui/material";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import DirectionsSubwayIcon from "@mui/icons-material/DirectionsSubway";
import {convertMillisecondsToDate} from "../../../utils/services";
import {TShipmentsType} from "../../../models/iShipments";
import ShipmentTypeIcon from "./ShipmentTypeIcon";

interface IProps {
    selected: boolean
    id: string
    transporter: string
    lading_number: string
    receiving_date: number | undefined
    author_date: number
    type: TShipmentsType
    setActiveShipmentId: (id: string) => void
}

const ShipmentsSectionItem: FC<IProps> = memo(({
                                                   selected,
                                                   id,
                                                   transporter,
                                                   lading_number,
                                                   receiving_date,
                                                   author_date,
                                                   type,
                                                   setActiveShipmentId
                                               }) => {
    const handleClick = useCallback(() => setActiveShipmentId(id), [id, setActiveShipmentId]);
    const received = Boolean(receiving_date && receiving_date > 0);
    const authorDateStr = useMemo(() => convertMillisecondsToDate(author_date), [author_date]);
    const receivingDateStr = useMemo(
        () => (received ? 'получено' : 'в пути'),
        [received, receiving_date]
    );
    return (
        <ListItemButton
            id={`shipment-item-${id}`}
            role="option"
            selected={selected}
            aria-selected={selected}
            onClick={handleClick}
            sx={{borderRadius: 1, mb: 0.5, alignItems: 'flex-start'}}
        >
            <ListItemText
                slotProps={{primary: {component: 'div'}, secondary: {component: 'div'}}}
                primary={
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                        <Stack direction="row" spacing={1} sx={{minWidth: 0}} alignItems="center">
                            <Typography variant="body2" fontWeight={600} noWrap>
                                {transporter}
                            </Typography>
                            <Typography variant="subtitle2" color="text.secondary">
                                {lading_number}
                            </Typography>
                        </Stack>
                        <ShipmentTypeIcon type={type} received={received}/>
                    </Stack>
                }
                secondary={
                    <Stack direction="row"
                           spacing={1}
                           alignItems="center"
                           justifyContent="space-between"
                           mt={1}>
                        <Typography variant="caption" color="text.secondary" noWrap>
                            Отгружено: {authorDateStr}
                        </Typography>
                        <Typography variant="caption"
                                    fontWeight={600}
                                    color={received ? "success" : "text.warning"}
                                    noWrap>
                            {receivingDateStr}
                        </Typography>
                    </Stack>
                }
            />
        </ListItemButton>
    );
}, (prev, next) => (
    prev.selected === next.selected &&
    prev.id === next.id &&
    prev.transporter === next.transporter &&
    prev.lading_number === next.lading_number &&
    prev.receiving_date === next.receiving_date &&
    prev.author_date === next.author_date &&
    prev.type === next.type
));

export default memo(ShipmentsSectionItem);