import React, {FC, memo} from 'react';
import Card from "@mui/material/Card";
import {defaultShipment, emptyShipment, INewShipments, IShipments} from "../../../models/iShipments";
import TitleWithValue from "../../../components/TitleWithValue";
import {convertMillisecondsToDate} from "../../../utils/services";
import {Button, CardHeader, Checkbox, Chip, FormControlLabel, Stack, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import {selectCurrentUserId} from "../../users/model/selectors";
import {fetchUpdateShipment} from "../model/actions";
import {selectShipmentsIsLoading} from "../model/selectors";
import DownloadIcon from "@mui/icons-material/Download";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CardContent from "@mui/material/CardContent";
import {EditableSpan} from "../../../components/common/EditableSpan";
import {useEditor} from "../../../hooks/useEditor";
import {shipmentValidate} from "../../../utils/validators";
import ShipmentTypeIcon from "./ShipmentTypeIcon";

const InfoGrid: React.FC<{ children: React.ReactNode }> = ({children}) => (
    <Box
        sx={{
            display: "grid",
            gridTemplateColumns: {
                xs: "1fr",               // мобильные — 1 колонка
                sm: "repeat(1, 1fr)",    // планшеты — 2
                md: "repeat(2, 1fr)",    // десктоп — 3
            },
            gap: 4, // одинаковые отступы между ячейками
        }}
    >
        {children}
    </Box>
);

interface IProps {
    shipment: IShipments | null;
}

const ShipmentShow: FC<IProps> = ({shipment}) => {
    console.log(shipment)
    const dispatch = useAppDispatch();
    const currentUserId = useAppSelector(selectCurrentUserId);
    const isLoading = useAppSelector(selectShipmentsIsLoading)
    const receivingChangeHandler = (checked: boolean) => {
        if (!shipment) return;
        const updated_shipment = checked
            ? {
                ...shipment,
                receiving_is_receiving: true,
                receiving_date: Date.now(),
                receiving_author_id: currentUserId,
            }
            : {
                ...shipment,
                receiving_is_receiving: false,
                receiving_date: null,
                receiving_author_id: null,
                receiving_author: null,
            };
        dispatch(fetchUpdateShipment(updated_shipment));
    };

    if (!shipment) return null;
    const ladingNumberChangeHandler = (newValue: number | string) => {
        dispatch(fetchUpdateShipment({
            ...shipment,
            lading_number: `${newValue}`,
        }))
    }
    const received = shipment.receiving_is_receiving;
    return (
        <Card sx={{p: {xs: 1, sm: 2}, minHeight: 200}}>
            <CardHeader
                title={<Stack direction={"row"} spacing={2} alignItems={"center"}>
                    <Typography component="h2" variant="h5">
                        {shipment.transporter || "Перевозчик не указан"}
                    </Typography>
                    <ShipmentTypeIcon type={shipment.type}
                                      received={shipment.receiving_is_receiving}/>
                </Stack>}
                subheader={
                    <Stack direction="row" spacing={1} alignItems={"center"}>
                        <Typography variant={"subtitle1"}>№</Typography>
                        <EditableSpan value={shipment.lading_number}
                                      onChange={ladingNumberChangeHandler}
                                      maxWidth={250}/>

                    </Stack>}
                action={
                    <Chip
                        size="small"
                        label={received ? "получено" : "в пути"}
                        color={received ? "success" : "warning"}
                    />
                }
                sx={{
                    pb: 1,
                    "& .MuiCardHeader-title": {fontWeight: 600},
                    "& .MuiCardHeader-subheader": {color: "text.secondary"},
                }}
            />
            <Divider sx={{mb: 2}}/>
            <CardContent sx={{pt: 0}}>
                <InfoGrid>
                    <TitleWithValue
                        title="Отгружено:"
                        value={convertMillisecondsToDate(shipment.author_date)}
                        isLoading={isLoading}
                    />
                    <TitleWithValue
                        title="Отгрузил:"
                        value={
                            shipment.author
                                ? `${shipment.author.first_name} ${shipment.author.middle_name}`
                                : ""
                        }
                        isLoading={isLoading}
                    />
                    <TitleWithValue title="Получено:" isLoading={isLoading}>
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                        >
                            <FormControlLabel
                                labelPlacement="start"
                                control={
                                    <Checkbox
                                        checked={received}
                                        onChange={(_, checked) => receivingChangeHandler(checked)}
                                        disabled={isLoading}
                                    />
                                }
                                label={received ? "" : "Отметить как полученое"}
                            />
                            {shipment.receiving_date && +shipment.receiving_date > 1 && (
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {convertMillisecondsToDate(shipment.receiving_date)}
                                </Typography>
                            )}
                        </Stack>
                    </TitleWithValue>
                    {shipment.receiving_author && (
                        <TitleWithValue
                            title="Получил:"
                            value={`${shipment.receiving_author.first_name} ${shipment.receiving_author.middle_name}`}
                            isLoading={isLoading}
                        />
                    )}
                    {shipment.lading_file_path && (
                        <Box sx={{gridColumn: {xs: "1 / -1", sm: "auto"}}}>
                            <TitleWithValue title="Накладная">
                                <Button
                                    startIcon={<DownloadIcon/>}
                                    size="small"
                                    href={shipment.lading_file_path}
                                    target="_blank"
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    sx={{textTransform: "none"}}
                                >
                                    Скачать накладную
                                </Button>
                            </TitleWithValue>
                        </Box>
                    )}
                </InfoGrid>
            </CardContent>
        </Card>
    );
};

export default memo(ShipmentShow);